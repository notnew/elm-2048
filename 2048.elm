import Keyboard
import Random
import Text
import Window

(width, height) = (400, 400)
borderWidth = 10
tileCount = 4
tileWidth = (width - (tileCount+1)*borderWidth) `div` tileCount
tileHeight = (height - (tileCount+1)*borderWidth) `div` tileCount
(frameWidth, frameHeight) = (tileWidth + borderWidth, tileHeight + borderWidth)

data Tile = Blank | Numbered Int

isBlank t = case t of
              Blank -> True
              _     -> False

type Board = [[Tile]]

defaultBoard : Board
defaultBoard = addTile 2 (Numbered 2) . addTile 4 (Numbered 2)
                   <| repeat 4 <| repeat 4 <| Blank
-- defaultBoard = [ [Blank, Blank, Blank, Numbered 2]
--                , [Blank, Blank, Numbered 2, Numbered 4]
--                , [Blank, Numbered 345, Blank, Numbered 292]
--                , [Blank, Blank, Blank, Blank]]

slideRow : [Tile] -> [Tile]
slideRow ts =
    let (blanks,ns) = partition isBlank ts
        combine ns = case ns of
                       (Numbered a::Numbered b::ns) ->
                           if a == b
                           then (Numbered (a+b)::combine ns) ++ [Blank]
                           else (Numbered a :: combine (Numbered b ::ns))
                       ns -> ns
    in combine ns ++ blanks

stepBoard : ({x:Int, y:Int}, Int) -> Board -> Board
stepBoard (kbdArrows, rand) brd =
    let newTile = (Numbered (if rand `mod` 4 == 0 then 4 else 2))
        brd' = slide kbdArrows brd
    in if | brd' == brd -> brd
          | otherwise   -> addTile rand newTile brd'

addTile : Int -> Tile -> Board -> Board
addTile i new brd =
    let countBlanks = foldl (\t sum -> if isBlank t then (1+sum) else sum) 0
        idx = i `mod` (sum <| map countBlanks brd)
        replace i (ts::tss) = let blanks = countBlanks ts
                              in if i < blanks
                                 then (replaceInRow i ts) :: tss
                                 else ts :: (replace (i-blanks) tss)
        replaceInRow : Int -> [Tile] -> [Tile]
        replaceInRow i (t::ts) = case (i, t) of
                               (0, Blank) -> new::ts
                               (i, Blank) -> Blank :: (replaceInRow (i-1) ts)
                               _          -> t :: (replaceInRow i ts)
    in replace idx brd

slide : {x:Int, y:Int} -> Board -> Board
slide {x,y} = case (x,y) of
   (-1,0) -> map slideRow
   (1,0)  -> map (reverse . slideRow . reverse)
   (0,1)  -> transpose . map slideRow . transpose
   (0,-1) -> transpose . map (reverse . slideRow . reverse) . transpose
   _      -> id

showTile : Tile -> Element
showTile t =
    let fontHeight n = toFloat tileHeight /
                         (1.5 + toFloat (String.length <| show n) * 0.5)
    in case t of
         Blank      -> empty |> size tileWidth tileHeight |> color darkGrey
         Numbered n -> show n |> toText
                              |> Text.height (fontHeight n)
                              |> monospace |> Text.color charcoal |> bold
                              |> text
                              |> container tileWidth tileHeight middle
                              |> color grey

render : (Int, Int) -> Board -> Element
render (w,h) board =
    let -- canv = collage width height forms
        rowToForm row = flow right <| map (frameTile . showTile) row
        frameTile = container frameWidth frameHeight middle
        grid = map rowToForm board |> flow down |> container width height middle
    in container w h middle <| color lightCharcoal <| grid

kbd : Signal {x:Int, y:Int}
kbd = dropWhen (isEmpty <~ Keyboard.keysDown)  {x=0,y=0} Keyboard.arrows

event : Signal ({x:Int, y:Int} , Int)
event = let rangeMax = product <| [1..16] -- factorial of 16
        in lift2 (,) kbd <| Random.range 0 rangeMax kbd

main = render <~ Window.dimensions ~ foldp stepBoard (defaultBoard) event

-- helpers
transpose : [[a]] -> [[a]]
transpose mat = let heads xxs = if any isEmpty xxs
                                then []
                                else map head xxs
                in case heads mat of
                     [] -> []
                     hs -> hs :: (transpose <| map tail mat)
