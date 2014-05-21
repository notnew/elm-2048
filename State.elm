module State where

hiddenState : st -> (a -> st -> (st,b)) -> b -> Signal a -> Signal b
hiddenState st step default =
    let step' a (s,_) = step a s
    in lift snd . foldp step' (st, default)

