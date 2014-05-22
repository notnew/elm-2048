import Board
import Board ( slide, addTile, toElem, rowPoints, isStart, isDone, stabalize
             , progress )
import Direction as Dir
import Direction (..)
import Style (message)
import Swipe (swipes)

import Char
import Keyboard
import Random
import Text
import Window

import Graphics.Input (input, clickable)

data Hole = Hole

-- Model
type Game = {brd : Board.Board, score : Board.Score}

-- Update
data Event = Slide Dir.Direction [Float] | Restart [Float] | Animate Time

duration = 400 * millisecond

step : Event -> Game -> Game
step ev g = case ev of
              Slide dir rands -> stepGame (dir, rands) g
              Restart rands   -> newGame rands
              Animate dt      -> { g | brd <- progress (dt/duration) g.brd }

stepGame : (Dir.Direction, [Float]) -> Game -> Game
stepGame (dir, rands) ({brd, score} as g) =
    if | isStart brd -> newGame rands
       | otherwise -> let (pts, brd') = slide dir brd
                      in if brd' == stabalize brd then g
                            else {g | brd <- addTile (head rands) brd'
                                    , score <- score + pts}

newGame : [Float] -> Game
newGame (r1::r2::_) = { brd = Board.default |> addTile r1 |> addTile r2
                      , score = 0 }

-- Input
eventS : Signal Event
eventS = let restarts = merge (rand restartS.signal) (rand <| key 'r')
             rand s = Random.floatList (sampleOn s <| constant 2)
             key c = keepIf id False <| Keyboard.isDown <| Char.toCode c
             framerate = 15
             dts = snd <~ (foldp (\t (prev, _) -> (t, t-prev))
                                 (0,0)  <| every interval)
             animate = merge (since delay dir) (since delay restarts)
             interval = 1 * second / framerate
             delay = duration + interval
         in merges [ Restart <~ restarts
                   , Slide <~ dir ~ rand dir
                   , Animate <~ keepWhen animate 0 dts ]

restartS = input ()

dir : Signal Dir.Direction
dir = let kbd = fromArrow <~ Keyboard.arrows
                  |> dropWhen (isEmpty <~ Keyboard.keysDown) None
          swipe = swipesToDir <~ swipes
          swipesToDir ss = case ss of (s::[]) -> fromSwipe s
                                      _       -> None
          notNone d = case d of None -> False
                                otherwise -> True
      in merge kbd (keepIf notNone None swipe)

-- Display
gameOverElement : Int -> Element
gameOverElement sz = message sz 0.3 0.11 lightGrey "GAME OVER"
                     |> opacity 0.7

render : (Int, Int) -> Game -> Element
render (w,h) {brd, score} =
    let board = if | isStart brd ->
                       message sz 0.4 0.04 grey "Press Any Arrow Key to Start"
                   | isDone brd -> layers [ toElem sz brd
                                            , gameOverElement sz]
                   | otherwise    -> toElem sz brd
        scoreElem = "Score: " ++ show score |> toText |> Text.height txtHeight
                      |> leftAligned |> width (sz `div` 2)
        restart = clickable restartS.handle () <| layers [
           toText "Restart" |> Text.height txtHeight |> centered
               |> container (truncate <| 5*txtHeight)
                            (truncate <| 1.7*txtHeight)
                            middle
               |> color lightCharcoal
           , spacer 100 35]
        sz = max 400 <| truncate (toFloat (min w h) * 0.85)
        txtHeight = toFloat sz * 0.065
        frame = container sz (sz + truncate (1.9*txtHeight))
    in container w (h-5) middle
           <| layers [ frame midBottom <| color lightCharcoal board
                     , frame topRight restart
                     , frame topLeft scoreElem]

main = render <~ Window.dimensions
               ~ foldp step {brd = [], score = 0} eventS

-- helpers
on : (b -> b -> c) -> (a -> b) -> a -> a -> c
on f g x y = f (g x) (g y)
