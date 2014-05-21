module Swipe where

import Dict (Dict, fromList, diff)
import Dict
import Touch

import State (hiddenState)

type TouchRec a = { a | id: Int, t0: Float, x:Int, x0:Int, y:Int, y0:Int}
type Swipe = TouchRec {t:Time}

type TR = TouchRec {}

swipes : Signal [Swipe]
swipes =
    let timedTouches = (,) <~ Touch.touches
                            ~ sampleOn Touch.touches (every millisecond)
        hStep : ([TR], Time) -> Dict Int TR -> (Dict Int TR, [Swipe])
        hStep (ts,time) d =
            let d' = fromList <| map (\t -> (t.id, t)) ts
                removed = d `diff` d'
                addTime rec = {rec | t = time}
                swipes = map addTime <| Dict.values removed
            in (d', swipes)
    in dropRepeats <| hiddenState Dict.empty hStep [] timedTouches
