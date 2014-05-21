module Board where

import Direction (..)
import Style (message)

type Board = [[Tile]]
data Tile = Blank | Numbered Int
type Score = Int

tileCount = 4

default : Board
default =  repeat 4 <| repeat 4 <| Blank
-- default= [ [Numbered 2, Numbered 32, Numbered 64, Blank]
--          , [Numbered 4, Numbered 512, Numbered 2048, Blank]
--          , [Numbered 8, Numbered 1024, Numbered 256, Blank]
--          , [Numbered 16, Numbered 128, Blank, Blank]]

isStart : Board -> Bool
isStart = isEmpty

isDone : Board -> Bool
isDone brd = let blanks =  sum .  map (length . filter isBlank)
                 full = isEmpty . concat . map (filter isBlank)
             in if | full brd && full (snd <| slide Left brd)
                              && full (snd <| slide Up brd)   -> True
                   | otherwise                                -> False

tileVal : Tile -> Int
tileVal t = case t of (Numbered n) -> n
                      _ -> 0

isBlank : Tile -> Bool
isBlank tile = case tile of Blank -> True
                            _     -> False


-- Update
slideRow : [Tile] -> (Score, [Tile])
slideRow ts =
    let go : [Int] -> (Score, [Tile])
        go ns = if | hasTwo ns && head ns == head (tail ns) ->
                      let sum = 2* head ns
                      in cons (sum, Numbered sum) <|  go (tail <| tail ns)
                   | isEmpty ns -> (0, [])
                   | otherwise  -> cons (0, Numbered <| head ns) <| go (tail ns)
        vals = filter (not . isBlank) ts |> map tileVal
        pad ts = ts ++ repeat 4 Blank |> take tileCount
        hasTwo xs = case xs of (_::_::_) -> True
                               otherwise  -> False
    in second pad <| go vals

slide : Direction -> Board -> (Score, Board)
slide dir =
    let sum : [(Score, [Tile])] -> (Score, Board)
        sum = foldr cons (0, [])
        right = second reverse . slideRow . reverse
    in case dir of
        Left  -> sum . map slideRow
        Right -> sum . map right
        Up    -> second transpose . sum . map slideRow . transpose
        Down  -> second transpose . sum . map right . transpose
        _     -> \brd -> (0, brd)

addTile : Float -> Board -> Board
addTile rand brd =
    let newTile = Numbered <| if fourP then 4 else 2
        idx = truncate <| rand * toFloat blankCount
        insert : Int -> [Tile] -> Board -> Board
        insert i row brd = case (i, brd) of
            (_, []::tss)            -> row :: (insert i [] tss)
            (0, ((Blank::ts)::tss)) -> (row ++ newTile::ts) :: tss
            (_, ((Blank::ts)::tss)) -> insert (i-1) (row ++ [Blank]) (ts::tss)
            (_, (t::ts)::tss)       -> insert i (row++[t]) (ts::tss)
            (_, [])                 -> let t = Numbered idx in [[t,t,t]] -- error
        countBlanks = foldl (\t sum -> if isBlank t then (1+sum) else sum) 0
        blankCount = sum <| map countBlanks brd
        fourP = truncate (rand * 100) `mod` 10 == 0
    in insert idx [] brd

-- Display
showTile : Int -> Tile -> Element
showTile sz t =
    let h = 0.8 / (1.5 + toFloat (String.length s) * 0.3)
        n = if isBlank t then 1 else tileVal t
        s = if isBlank t then " " else show n
        bg = let fraction = toFloat (logBase 2 n) / 5.5
                 phi = turns <| (2/3) - clamp fraction
                 clamp f = 2/3 * (f - (1/2) * toFloat (truncate f))
             in hsl phi (fraction/3) (linterp fraction 0.7 0.6)
    in message sz ((1-h)/2) h bg s

toElem : Int -> Board -> Element
toElem sz brd =
    let rowToForm row = flow right <| map (frame . showTile tileSz) row
        frame = container frameSz frameSz middle
        borderWidth = 10
        tileSz = (sz - (tileCount+1)*borderWidth) `div` tileCount
        frameSz = tileSz + borderWidth
    in map rowToForm brd |> flow down |> container sz sz middle

-- Helpers
transpose : [[a]] -> [[a]]
transpose mat = let heads xxs = if any isEmpty xxs
                                then []
                                else map head xxs
                in case heads mat of
                     [] -> []
                     hs -> hs :: (transpose <| map tail mat)

second : (a -> b) -> (c, a) -> (c, b)
second f (s, brd) = (s, f brd)

cons : (Score, a) ->  (Score, [a]) -> (Score, [a])
cons (s, x) (s', xs) = (s+s', x::xs)

linterp : Float -> Float -> Float -> Float
linterp t a b = (1-t) * a  + t * b