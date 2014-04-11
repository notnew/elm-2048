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
getNum (Numbered n) = n

type Game = {brd : Board, score : Score}
type Board = [[Tile]]
type Score = Int

defaultBoard : Board
defaultBoard = addTile 2 <| addTile 4 blankBoard
blankBoard =  repeat 4 <| repeat 4 <| Blank
-- defaultBoard = [ [Numbered 2, Blank, Blank, Blank]
--                , [Numbered 2, Blank, Blank, Blank]
--                , [Numbered 8, Blank, Blank, Blank]
--                , [Numbered 8, Blank, Blank, Blank]]

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

stepGame : ({x:Int, y:Int}, Int) -> Game -> Game
stepGame ((kbdArrows, rand) as sig) ({brd, score} as g) =
    let newBrd = slide kbdArrows brd
        points = sum <| if kbdArrows.y==0
                        then zipWith rowPoints brd newBrd
                        else (zipWith rowPoints `on` transpose) brd newBrd
    in if | newBrd == brd -> g
          | otherwise -> {g | brd <- addTile rand newBrd
                            , score <- g.score + points}

rowPoints : [Tile] -> [Tile] -> Score
rowPoints old new =
    let sort' : [Tile] -> [Tile]
        sort' ts = sortWith (\(Numbered a) (Numbered b) -> a `compare` b)
                   <| filter (not . isBlank) ts
    in case (sort' old, sort' new) of
         (o::o'::os, n::ns) ->
             if | getNum o + getNum o' == getNum n ->
                    getNum n + rowPoints os ns
                | getNum o == getNum n   -> rowPoints (o'::os) ns
                | otherwise              ->  -9999999    --error
         _ -> 0

addTile : Int -> Board -> Board
addTile rand brd =
    let newTile = (Numbered (if rand `mod` 4 == 0 then 4 else 2))
        countBlanks = foldl (\t sum -> if isBlank t then (1+sum) else sum) 0
        idx = rand `mod` (sum <| map countBlanks brd)
        replace i (ts::tss) = let blanks = countBlanks ts
                              in if i < blanks
                                 then (replaceInRow i ts) :: tss
                                 else ts :: (replace (i-blanks) tss)
        replaceInRow : Int -> [Tile] -> [Tile]
        replaceInRow i (t::ts) = case (i, t) of
                               (0, Blank) -> newTile::ts
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

render : (Int, Int) -> Game -> Element
render (w,h) {brd, score} =
    let -- canv = collage width height forms
        rowToForm row = flow right <| map (frameTile . showTile) row
        frameTile = container frameWidth frameHeight middle
        grid = map rowToForm brd |> flow down |> container width height middle
    in container (w-10) (h-10) middle <| color lightCharcoal <|
         above (text . toText <| "Score: " ++ show score) grid

kbd : Signal {x:Int, y:Int}
kbd = dropWhen (isEmpty <~ Keyboard.keysDown)  {x=0,y=0} Keyboard.arrows

event : Signal ({x:Int, y:Int} , Int)
event = let rangeMax = product <| [1..16] -- factorial of 16
        in lift2 (,) kbd <| Random.range 0 rangeMax kbd

main = render <~ Window.dimensions
               ~ foldp stepGame {brd = defaultBoard, score = 0} event

-- helpers
transpose : [[a]] -> [[a]]
transpose mat = let heads xxs = if any isEmpty xxs
                                then []
                                else map head xxs
                in case heads mat of
                     [] -> []
                     hs -> hs :: (transpose <| map tail mat)

on : (b -> b -> c) -> (a -> b) -> a -> a -> c
on f g x y = f (g x) (g y)
