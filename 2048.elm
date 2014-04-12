import Keyboard
import Random
import Text
import Window

import Graphics.Input (input, clickable)

data Hole = Hole

(width, height) = (400, 400)
borderWidth = 10
tileCount = 4
tileWidth = (width - (tileCount+1)*borderWidth) `div` tileCount
tileHeight = (height - (tileCount+1)*borderWidth) `div` tileCount
(frameWidth, frameHeight) = (tileWidth + borderWidth, tileHeight + borderWidth)

-- MODEL
type Game = {brd : Board, score : Score}

type Board = [[Tile]]
data Tile = Blank | Numbered Int
type Score = Int

defaultBoard : Board
defaultBoard =  repeat 4 <| repeat 4 <| Blank
-- defaultBoard = [ [Numbered 2, Numbered 32, Numbered 64, Blank]
--                , [Numbered 4, Numbered 512, Numbered 2048, Blank]
--                , [Numbered 8, Numbered 1024, Numbered 256, Blank]
--                , [Numbered 16, Numbered 128, Blank, Blank]]

isBlank : Tile -> Bool
isBlank tile = case tile of Blank -> True
                            _     -> False
getNum : Tile -> Int
getNum (Numbered n) = n

startBoard : Board -> Bool
startBoard = isEmpty

gameOver : Board -> Bool
gameOver brd = slide Down brd == slide Up brd &&
               slide Left brd == slide Right brd &&
               slide Left brd == brd

rowPoints : [Tile] -> [Tile] -> Score
rowPoints old new =
    let sort' : [Tile] -> [Int]
        sort' ts = filter (not . isBlank) ts |> map getNum |> sort
        go : [Int] -> [Int] -> Score
        go olds news  = case (olds, news) of
           (o::o'::os, n::ns) ->
               if | o + o' == n -> n + go os ns
                  | o ==  n     -> go (o'::os) ns
                  | otherwise   ->  -9999999    --error
           _ -> 0
    in case (sort' old, sort' new) of (os, ns) -> go os ns

-- UPDATE
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

slide : Direction -> Board -> Board
slide dir = case dir of
   Left  -> map slideRow
   Right -> map (reverse . slideRow . reverse)
   Up    -> transpose . map slideRow . transpose
   Down  -> transpose . map (reverse . slideRow . reverse) . transpose
   _     -> id

step : Event -> Game -> Game
step ev = case ev of
            Slide dir rand -> stepGame (dir, rand)
            Restart rand   ->
                let brd = addTile rand <| addTile rand <| defaultBoard
                in \_ -> {brd = brd, score = 0}

stepGame : (Direction, Int) -> Game -> Game
stepGame (dir, rand) ({brd, score} as g) =
    let newBrd = if startBoard brd
                 then addTile rand  defaultBoard
                 else slide dir brd
        trans = case dir of
                  Up   -> transpose
                  Down -> transpose
                  _    -> id
        points = sum <| (zipWith rowPoints `on` trans) brd newBrd
    in if | newBrd == brd -> g
          | otherwise -> {g | brd <- addTile rand newBrd
                            , score <- score + points}

addTile : Int -> Board -> Board
addTile rand brd =
    let newTile = Numbered <| if modPow 19 rand idx < 4 then 4 else 2
        modPow m base exp = if | exp == 0 -> base `mod` m
                               | otherwise ->
                                   (base * modPow m base (exp-1)) `mod` m
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

-- Input
data Event = Slide Direction Int | Restart Int
data Direction = Left | Right | Up | Down | None

eventS : Signal Event
eventS = let rangeMax = product <| [1..16] -- factorial of 16
             toRandInt = Random.range 0 rangeMax
         in merge (Restart <~ toRandInt restartS.signal)
                <| Slide <~ kbd ~ toRandInt kbd

restartS = input ()

arrowToDir : {x:Int, y:Int} -> Direction
arrowToDir {x,y} = case (x,y) of
                     (-1,  0) -> Left
                     ( 1,  0) -> Right
                     ( 0, -1) -> Down
                     ( 0,  1) -> Up
                     _        -> None

kbd : Signal Direction
kbd = arrowToDir <~ Keyboard.arrows
        |> dropWhen (isEmpty <~ Keyboard.keysDown) None

-- Display
showTile : Tile -> Element
showTile t =
    let fontHeight n = toFloat tileHeight /
                         (1.5 + toFloat (String.length <| show n) * 0.5)
        bgColor n = Color (128 + (min 256 <| (n `div` 8) * 16)
                               - (n `div` 64) * 6 )
                          (128 + (n `div` 32) * 10)
                          (128 + (n `div` 128) * 15)
                          1
    in case t of
         Blank      -> empty |> size tileWidth tileHeight |> color darkGrey
         Numbered n -> show n |> toText
                              |> Text.height (fontHeight n)
                              |> monospace |> Text.color charcoal |> bold
                              |> centered
                              |> container tileWidth tileHeight middle
                              |> color (bgColor n)

showBoard : Board -> Element
showBoard brd =
    let rowToForm row = flow right <| map (frameTile . showTile) row
        frameTile = container frameWidth frameHeight middle
    in map rowToForm brd |> flow down |> container width height middle

gameOverElement : Element
gameOverElement = toText "GAME OVER" |> bold |> Text.height 35 |> centered
                  |> container width height
                       (midTopAt (relative 0.5) (relative 0.3))
                  |> color  lightGrey |> opacity 0.7

render : (Int, Int) -> Game -> Element
render (w,h) {brd, score} =
    let board = if | startBoard brd ->
                       plainText "Press Any Arrow Key to Start"
                           |> container width height middle
                   | gameOver brd -> layers [showBoard brd, gameOverElement]
                   | otherwise    -> showBoard brd
        scoreElem = "Score: " ++ show score |> toText
                      |> Text.height 25 |> rightAligned
        restart = clickable restartS.handle () <| layers [
           toText "Restart" |> Text.height 25 |> centered
               |> container 100 35 middle
               |> color lightCharcoal
           , spacer 100 35]
        frame = container width (height + 40)
    in container (w-10) (h-10) middle
           <| layers [ frame midBottom <| color lightCharcoal board
                     , frame topRight restart
                     , frame topLeft scoreElem]

main = render <~ Window.dimensions
               ~ foldp step {brd = [], score = 0} eventS

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
