module Direction where

import Swipe

data Direction = Left | Right | Up | Down | None

fromArrow : {x:Int, y:Int} -> Direction
fromArrow {x,y} = case (x,y) of
                     (-1,  0) -> Left
                     ( 1,  0) -> Right
                     ( 0, -1) -> Down
                     ( 0,  1) -> Up
                     _        -> None

fromSwipe : Swipe.Swipe -> Direction
fromSwipe {x0,x,y0,y} = let (dx,dy) = (x-x0, y-y0)
                            small = abs dx < 20 && abs dy < 20
                        in if | small                     -> None
                              | abs dx > abs dy && dx > 0 -> Right
                              | abs dx > abs dy           -> Left
                              | dy > 0                    -> Down
                              | otherwise                 -> Up

