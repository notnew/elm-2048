module Style where

message : Int -> Float -> Float -> Color -> String -> Element
message sz h txtSize bg s = toText s |> bold
                 |> Text.height (toFloat sz * txtSize)
                 |> Text.color charcoal |> bold
                 |> centered  |> width sz
                 |> container sz sz
                     (midTopAt (relative 0.5) (relative h))
                 |> color bg

