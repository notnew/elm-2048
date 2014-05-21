Elm.Main = Elm.Main || {};
Elm.Main.make = function (_elm) {
   "use strict";
   _elm.Main = _elm.Main || {};
   if (_elm.Main.values)
   return _elm.Main.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Main";
   var Basics = Elm.Basics.make(_elm);
   var Board = Elm.Board.make(_elm);
   var Char = Elm.Char.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Direction = Elm.Direction.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Input = Elm.Graphics.Input.make(_elm);
   var Keyboard = Elm.Keyboard.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Random = Elm.Random.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Style = Elm.Style.make(_elm);
   var Swipe = Elm.Swipe.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var Window = Elm.Window.make(_elm);
   var _op = {};
   var on = F4(function (f,g,x,y) {
      return A2(f,g(x),g(y));
   });
   var gameOverElement = function (sz) {
      return Graphics.Element.opacity(0.7)(A5(Style.message,
      sz,
      0.3,
      0.11,
      Color.lightGrey,
      "GAME OVER"));
   };
   var dir = function () {
      var notNone = function (d) {
         return function () {
            switch (d.ctor)
            {case "None": return false;}
            return true;
         }();
      };
      var swipesToDir = function (ss) {
         return function () {
            switch (ss.ctor)
            {case "::": switch (ss._1.ctor)
                 {case "[]":
                    return Direction.fromSwipe(ss._0);}
                 break;}
            return Direction.None;
         }();
      };
      var swipe = A2(Signal._op["<~"],
      swipesToDir,
      Swipe.swipes);
      var kbd = A2(Signal.dropWhen,
      A2(Signal._op["<~"],
      List.isEmpty,
      Keyboard.keysDown),
      Direction.None)(A2(Signal._op["<~"],
      Direction.fromArrow,
      Keyboard.arrows));
      return A2(Signal.merge,
      kbd,
      A3(Signal.keepIf,
      notNone,
      Direction.None,
      swipe));
   }();
   var restartS = Graphics.Input.input({ctor: "_Tuple0"});
   var render = F2(function (_v4,
   _v5) {
      return function () {
         return function () {
            switch (_v4.ctor)
            {case "_Tuple2":
               return function () {
                    var sz = Basics.max(400)(Basics.truncate(Basics.toFloat(A2(Basics.min,
                    _v4._0,
                    _v4._1)) * 0.85));
                    var txtHeight = Basics.toFloat(sz) * 6.5e-2;
                    var frame = A2(Graphics.Element.container,
                    sz,
                    sz + Basics.truncate(1.9 * txtHeight));
                    var restart = A2(Graphics.Input.clickable,
                    restartS.handle,
                    {ctor: "_Tuple0"})(Graphics.Element.layers(_L.fromArray([Graphics.Element.color(Color.lightCharcoal)(A3(Graphics.Element.container,
                                                                            Basics.truncate(5 * txtHeight),
                                                                            Basics.truncate(1.7 * txtHeight),
                                                                            Graphics.Element.middle)(Text.centered(Text.height(txtHeight)(Text.toText("Restart")))))
                                                                            ,A2(Graphics.Element.spacer,
                                                                            100,
                                                                            35)])));
                    var scoreElem = Graphics.Element.width(sz / 2 | 0)(Text.leftAligned(Text.height(txtHeight)(Text.toText(_L.append("Score: ",
                    String.show(_v5.score))))));
                    var board = Board.isStart(_v5.brd) ? A5(Style.message,
                    sz,
                    0.4,
                    4.0e-2,
                    Color.grey,
                    "Press Any Arrow Key to Start") : Board.isDone(_v5.brd) ? Graphics.Element.layers(_L.fromArray([A2(Board.toElem,
                                                                                                                   sz,
                                                                                                                   _v5.brd)
                                                                                                                   ,gameOverElement(sz)])) : A2(Board.toElem,
                    sz,
                    _v5.brd);
                    return A3(Graphics.Element.container,
                    _v4._0,
                    _v4._1 - 5,
                    Graphics.Element.middle)(Graphics.Element.layers(_L.fromArray([frame(Graphics.Element.midBottom)(A2(Graphics.Element.color,
                                                                                  Color.lightCharcoal,
                                                                                  board))
                                                                                  ,A2(frame,
                                                                                  Graphics.Element.topRight,
                                                                                  restart)
                                                                                  ,A2(frame,
                                                                                  Graphics.Element.topLeft,
                                                                                  scoreElem)])));
                 }();}
            _E.Case($moduleName,
            "between lines 68 and 88");
         }();
      }();
   });
   var newGame = function (_v10) {
      return function () {
         switch (_v10.ctor)
         {case "::":
            switch (_v10._1.ctor)
              {case "::": return {_: {}
                                 ,brd: Board.addTile(_v10._1._0)(Board.addTile(_v10._0)(Board.$default))
                                 ,score: 0};}
              break;}
         _E.Case($moduleName,
         "between lines 38 and 39");
      }();
   };
   var stepGame = F2(function (_v16,
   _v17) {
      return function () {
         return function () {
            switch (_v16.ctor)
            {case "_Tuple2":
               return Board.isStart(_v17.brd) ? newGame(_v16._1) : function () {
                    var $ = A2(Board.slide,
                    _v16._0,
                    _v17.brd),
                    pts = $._0,
                    brd$ = $._1;
                    return _U.eq(brd$,
                    _v17.brd) ? _v17 : _U.replace([["brd"
                                                   ,A2(Board.addTile,
                                                   List.head(_v16._1),
                                                   brd$)]
                                                  ,["score",_v17.score + pts]],
                    _v17);
                 }();}
            _E.Case($moduleName,
            "between lines 31 and 35");
         }();
      }();
   });
   var Restart = function (a) {
      return {ctor: "Restart"
             ,_0: a};
   };
   var Slide = F2(function (a,b) {
      return {ctor: "Slide"
             ,_0: a
             ,_1: b};
   });
   var step = function (ev) {
      return function () {
         switch (ev.ctor)
         {case "Restart":
            return Basics.always(newGame(ev._0));
            case "Slide":
            return stepGame({ctor: "_Tuple2"
                            ,_0: ev._0
                            ,_1: ev._1});}
         _E.Case($moduleName,
         "between lines 25 and 27");
      }();
   };
   var eventS = function () {
      var key = function (c) {
         return A2(Signal.keepIf,
         Basics.id,
         false)(Keyboard.isDown(Char.toCode(c)));
      };
      var rand = function (s) {
         return Random.floatList(Signal.sampleOn(s)(Signal.constant(2)));
      };
      return Signal.merges(_L.fromArray([A2(Signal._op["<~"],
                                        Restart,
                                        rand(restartS.signal))
                                        ,A2(Signal._op["<~"],
                                        Restart,
                                        rand(key(_U.chr("r"))))
                                        ,A2(Signal._op["~"],
                                        A2(Signal._op["<~"],Slide,dir),
                                        rand(dir))]));
   }();
   var main = A2(Signal._op["~"],
   A2(Signal._op["<~"],
   render,
   Window.dimensions),
   A3(Signal.foldp,
   step,
   {_: {}
   ,brd: _L.fromArray([])
   ,score: 0},
   eventS));
   var Game = F2(function (a,b) {
      return {_: {}
             ,brd: a
             ,score: b};
   });
   var Hole = {ctor: "Hole"};
   _elm.Main.values = {_op: _op
                      ,step: step
                      ,stepGame: stepGame
                      ,newGame: newGame
                      ,eventS: eventS
                      ,restartS: restartS
                      ,dir: dir
                      ,gameOverElement: gameOverElement
                      ,render: render
                      ,main: main
                      ,on: on
                      ,Hole: Hole
                      ,Slide: Slide
                      ,Restart: Restart
                      ,Game: Game};
   return _elm.Main.values;
};Elm.Board = Elm.Board || {};
Elm.Board.make = function (_elm) {
   "use strict";
   _elm.Board = _elm.Board || {};
   if (_elm.Board.values)
   return _elm.Board.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Board";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Direction = Elm.Direction.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Style = Elm.Style.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var linterp = F3(function (t,
   a,
   b) {
      return (1 - t) * a + t * b;
   });
   var cons = F2(function (_v0,
   _v1) {
      return function () {
         switch (_v1.ctor)
         {case "_Tuple2":
            return function () {
                 switch (_v0.ctor)
                 {case "_Tuple2":
                    return {ctor: "_Tuple2"
                           ,_0: _v0._0 + _v1._0
                           ,_1: {ctor: "::"
                                ,_0: _v0._1
                                ,_1: _v1._1}};}
                 _E.Case($moduleName,
                 "on line 115, column 25 to 36");
              }();}
         _E.Case($moduleName,
         "on line 115, column 25 to 36");
      }();
   });
   var second = F2(function (f,
   _v8) {
      return function () {
         switch (_v8.ctor)
         {case "_Tuple2":
            return {ctor: "_Tuple2"
                   ,_0: _v8._0
                   ,_1: f(_v8._1)};}
         _E.Case($moduleName,
         "on line 112, column 22 to 30");
      }();
   });
   var transpose = function (mat) {
      return function () {
         var heads = function (xxs) {
            return A2(List.any,
            List.isEmpty,
            xxs) ? _L.fromArray([]) : A2(List.map,
            List.head,
            xxs);
         };
         return function () {
            var _v12 = heads(mat);
            switch (_v12.ctor)
            {case "[]":
               return _L.fromArray([]);}
            return {ctor: "::"
                   ,_0: _v12
                   ,_1: transpose(A2(List.map,
                   List.tail,
                   mat))};
         }();
      }();
   };
   var isStart = List.isEmpty;
   var tileCount = 4;
   var Numbered = function (a) {
      return {ctor: "Numbered"
             ,_0: a};
   };
   var tileVal = function (t) {
      return function () {
         switch (t.ctor)
         {case "Numbered": return t._0;}
         return 0;
      }();
   };
   var Blank = {ctor: "Blank"};
   var $default = List.repeat(4)(List.repeat(4)(Blank));
   var isBlank = function (tile) {
      return function () {
         switch (tile.ctor)
         {case "Blank": return true;}
         return false;
      }();
   };
   var showTile = F2(function (sz,
   t) {
      return function () {
         var n = isBlank(t) ? 1 : tileVal(t);
         var s = isBlank(t) ? " " : String.show(n);
         var bg = function () {
            var clamp = function (f) {
               return 2 / 3 * (f - 1 / 2 * Basics.toFloat(Basics.truncate(f)));
            };
            var fraction = Basics.toFloat(A2(Basics.logBase,
            2,
            n)) / 5.5;
            var phi = Basics.turns(2 / 3 - clamp(fraction));
            return A3(Color.hsl,
            phi,
            fraction / 3,
            A3(linterp,fraction,0.7,0.6));
         }();
         var h = 0.8 / (1.5 + Basics.toFloat(String.length(s)) * 0.3);
         return A5(Style.message,
         sz,
         (1 - h) / 2,
         h,
         bg,
         s);
      }();
   });
   var toElem = F2(function (sz,
   brd) {
      return function () {
         var borderWidth = 10;
         var tileSz = (sz - (tileCount + 1) * borderWidth) / tileCount | 0;
         var frameSz = tileSz + borderWidth;
         var frame = A3(Graphics.Element.container,
         frameSz,
         frameSz,
         Graphics.Element.middle);
         var rowToForm = function (row) {
            return Graphics.Element.flow(Graphics.Element.right)(A2(List.map,
            function ($) {
               return frame(showTile(tileSz)($));
            },
            row));
         };
         return A3(Graphics.Element.container,
         sz,
         sz,
         Graphics.Element.middle)(Graphics.Element.flow(Graphics.Element.down)(A2(List.map,
         rowToForm,
         brd)));
      }();
   });
   var slideRow = function (ts) {
      return function () {
         var hasTwo = function (xs) {
            return function () {
               switch (xs.ctor)
               {case "::": switch (xs._1.ctor)
                    {case "::": return true;}
                    break;}
               return false;
            }();
         };
         var pad = function (ts) {
            return List.take(tileCount)(_L.append(ts,
            A2(List.repeat,4,Blank)));
         };
         var vals = List.map(tileVal)(A2(List.filter,
         function ($) {
            return Basics.not(isBlank($));
         },
         ts));
         var go = function (ns) {
            return hasTwo(ns) && _U.eq(List.head(ns),
            List.head(List.tail(ns))) ? function () {
               var sum = 2 * List.head(ns);
               return cons({ctor: "_Tuple2"
                           ,_0: sum
                           ,_1: Numbered(sum)})(go(List.tail(List.tail(ns))));
            }() : List.isEmpty(ns) ? {ctor: "_Tuple2"
                                     ,_0: 0
                                     ,_1: _L.fromArray([])} : cons({ctor: "_Tuple2"
                                                                   ,_0: 0
                                                                   ,_1: Numbered(List.head(ns))})(go(List.tail(ns)));
         };
         return second(pad)(go(vals));
      }();
   };
   var slide = function (dir) {
      return function () {
         var right = function ($) {
            return second(List.reverse)(slideRow(List.reverse($)));
         };
         var sum = A2(List.foldr,
         cons,
         {ctor: "_Tuple2"
         ,_0: 0
         ,_1: _L.fromArray([])});
         return function () {
            switch (dir.ctor)
            {case "Down":
               return function ($) {
                    return second(transpose)(sum(List.map(right)(transpose($))));
                 };
               case "Left":
               return function ($) {
                    return sum(List.map(slideRow)($));
                 };
               case "Right":
               return function ($) {
                    return sum(List.map(right)($));
                 };
               case "Up": return function ($) {
                    return second(transpose)(sum(List.map(slideRow)(transpose($))));
                 };}
            return function (brd) {
               return {ctor: "_Tuple2"
                      ,_0: 0
                      ,_1: brd};
            };
         }();
      }();
   };
   var isDone = function (brd) {
      return function () {
         var full = function ($) {
            return List.isEmpty(List.concat(List.map(List.filter(isBlank))($)));
         };
         var blanks = function ($) {
            return List.sum(List.map(function ($) {
               return List.length(List.filter(isBlank)($));
            })($));
         };
         return full(brd) && (full(Basics.snd(A2(slide,
         Direction.Left,
         brd))) && full(Basics.snd(A2(slide,
         Direction.Up,
         brd)))) ? true : false;
      }();
   };
   var addTile = F2(function (rand,
   brd) {
      return function () {
         var fourP = _U.eq(A2(Basics.mod,
         Basics.truncate(rand * 100),
         10),
         0);
         var countBlanks = A2(List.foldl,
         F2(function (t,sum) {
            return isBlank(t) ? 1 + sum : sum;
         }),
         0);
         var blankCount = List.sum(A2(List.map,
         countBlanks,
         brd));
         var idx = Basics.truncate(rand * Basics.toFloat(blankCount));
         var newTile = Numbered(fourP ? 4 : 2);
         var insert = F3(function (i,
         row,
         brd) {
            return function () {
               var _v22 = {ctor: "_Tuple2"
                          ,_0: i
                          ,_1: brd};
               switch (_v22.ctor)
               {case "_Tuple2":
                  switch (_v22._1.ctor)
                    {case "::":
                       switch (_v22._1._0.ctor)
                         {case "[]": return {ctor: "::"
                                            ,_0: row
                                            ,_1: A3(insert,
                                            i,
                                            _L.fromArray([]),
                                            _v22._1._1)};}
                         break;}
                    switch (_v22._0)
                    {case 0: switch (_v22._1.ctor)
                         {case "::":
                            switch (_v22._1._0.ctor)
                              {case "::":
                                 switch (_v22._1._0._0.ctor)
                                   {case "Blank":
                                      return {ctor: "::"
                                             ,_0: _L.append(row,
                                             {ctor: "::"
                                             ,_0: newTile
                                             ,_1: _v22._1._0._1})
                                             ,_1: _v22._1._1};}
                                   break;}
                              break;}
                         break;}
                    switch (_v22._1.ctor)
                    {case "::":
                       switch (_v22._1._0.ctor)
                         {case "::":
                            switch (_v22._1._0._0.ctor)
                              {case "Blank": return A3(insert,
                                   i - 1,
                                   _L.append(row,
                                   _L.fromArray([Blank])),
                                   {ctor: "::"
                                   ,_0: _v22._1._0._1
                                   ,_1: _v22._1._1});}
                              return A3(insert,
                              i,
                              _L.append(row,
                              _L.fromArray([_v22._1._0._0])),
                              {ctor: "::"
                              ,_0: _v22._1._0._1
                              ,_1: _v22._1._1});}
                         break;
                       case "[]": return function () {
                            var t = Numbered(idx);
                            return _L.fromArray([_L.fromArray([t
                                                              ,t
                                                              ,t])]);
                         }();}
                    break;}
               _E.Case($moduleName,
               "between lines 70 and 76");
            }();
         });
         return A3(insert,
         idx,
         _L.fromArray([]),
         brd);
      }();
   });
   _elm.Board.values = {_op: _op
                       ,tileCount: tileCount
                       ,$default: $default
                       ,isStart: isStart
                       ,isDone: isDone
                       ,tileVal: tileVal
                       ,isBlank: isBlank
                       ,slideRow: slideRow
                       ,slide: slide
                       ,addTile: addTile
                       ,showTile: showTile
                       ,toElem: toElem
                       ,transpose: transpose
                       ,second: second
                       ,cons: cons
                       ,linterp: linterp
                       ,Blank: Blank
                       ,Numbered: Numbered};
   return _elm.Board.values;
};Elm.Direction = Elm.Direction || {};
Elm.Direction.make = function (_elm) {
   "use strict";
   _elm.Direction = _elm.Direction || {};
   if (_elm.Direction.values)
   return _elm.Direction.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Direction";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Swipe = Elm.Swipe.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var None = {ctor: "None"};
   var Down = {ctor: "Down"};
   var Up = {ctor: "Up"};
   var Right = {ctor: "Right"};
   var Left = {ctor: "Left"};
   var fromArrow = function (_v0) {
      return function () {
         return function () {
            var _v2 = {ctor: "_Tuple2"
                      ,_0: _v0.x
                      ,_1: _v0.y};
            switch (_v2.ctor)
            {case "_Tuple2": switch (_v2._0)
                 {case -1: switch (_v2._1)
                      {case 0: return Left;}
                      break;
                    case 0: switch (_v2._1)
                      {case -1: return Down;
                         case 1: return Up;}
                      break;
                    case 1: switch (_v2._1)
                      {case 0: return Right;}
                      break;}
                 break;}
            return None;
         }();
      }();
   };
   var fromSwipe = function (_v5) {
      return function () {
         return function () {
            var $ = {ctor: "_Tuple2"
                    ,_0: _v5.x - _v5.x0
                    ,_1: _v5.y - _v5.y0},
            dx = $._0,
            dy = $._1;
            var small = _U.cmp(Basics.abs(dx),
            20) < 0 && _U.cmp(Basics.abs(dy),
            20) < 0;
            return small ? None : _U.cmp(Basics.abs(dx),
            Basics.abs(dy)) > 0 && _U.cmp(dx,
            0) > 0 ? Right : _U.cmp(Basics.abs(dx),
            Basics.abs(dy)) > 0 ? Left : _U.cmp(dy,
            0) > 0 ? Down : Up;
         }();
      }();
   };
   _elm.Direction.values = {_op: _op
                           ,fromArrow: fromArrow
                           ,fromSwipe: fromSwipe
                           ,Left: Left
                           ,Right: Right
                           ,Up: Up
                           ,Down: Down
                           ,None: None};
   return _elm.Direction.values;
};Elm.Swipe = Elm.Swipe || {};
Elm.Swipe.make = function (_elm) {
   "use strict";
   _elm.Swipe = _elm.Swipe || {};
   if (_elm.Swipe.values)
   return _elm.Swipe.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Swipe";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Dict = Elm.Dict.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var State = Elm.State.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var Touch = Elm.Touch.make(_elm);
   var _op = {};
   var swipes = function () {
      var hStep = F2(function (_v0,
      d) {
         return function () {
            switch (_v0.ctor)
            {case "_Tuple2":
               return function () {
                    var addTime = function (rec) {
                       return _U.insert("t",
                       _v0._1,
                       rec);
                    };
                    var d$ = Dict.fromList(A2(List.map,
                    function (t) {
                       return {ctor: "_Tuple2"
                              ,_0: t.id
                              ,_1: t};
                    },
                    _v0._0));
                    var removed = A2(Dict.diff,
                    d,
                    d$);
                    var swipes = List.map(addTime)(Dict.values(removed));
                    return {ctor: "_Tuple2"
                           ,_0: d$
                           ,_1: swipes};
                 }();}
            _E.Case($moduleName,
            "between lines 20 and 24");
         }();
      });
      var timedTouches = A2(Signal._op["~"],
      A2(Signal._op["<~"],
      F2(function (v0,v1) {
         return {ctor: "_Tuple2"
                ,_0: v0
                ,_1: v1};
      }),
      Touch.touches),
      A2(Signal.sampleOn,
      Touch.touches,
      Time.every(Time.millisecond)));
      return Signal.dropRepeats(A4(State.hiddenState,
      Dict.empty,
      hStep,
      _L.fromArray([]),
      timedTouches));
   }();
   var TouchRec = F7(function (a,
   b,
   c,
   d,
   e,
   f,
   g) {
      return _U.insert("y0",
      f,
      _U.insert("y",
      e,
      _U.insert("x0",
      d,
      _U.insert("x",
      c,
      _U.insert("t0",
      b,
      _U.insert("id",a,g))))));
   });
   _elm.Swipe.values = {_op: _op
                       ,swipes: swipes
                       ,TouchRec: TouchRec};
   return _elm.Swipe.values;
};Elm.State = Elm.State || {};
Elm.State.make = function (_elm) {
   "use strict";
   _elm.State = _elm.State || {};
   if (_elm.State.values)
   return _elm.State.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "State";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var hiddenState = F3(function (st,
   step,
   $default) {
      return function () {
         var step$ = F2(function (a,
         _v0) {
            return function () {
               switch (_v0.ctor)
               {case "_Tuple2": return A2(step,
                    a,
                    _v0._0);}
               _E.Case($moduleName,
               "on line 5, column 25 to 33");
            }();
         });
         return function ($) {
            return Signal.lift(Basics.snd)(A2(Signal.foldp,
            step$,
            {ctor: "_Tuple2"
            ,_0: st
            ,_1: $default})($));
         };
      }();
   });
   _elm.State.values = {_op: _op
                       ,hiddenState: hiddenState};
   return _elm.State.values;
};Elm.Style = Elm.Style || {};
Elm.Style.make = function (_elm) {
   "use strict";
   _elm.Style = _elm.Style || {};
   if (_elm.Style.values)
   return _elm.Style.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Style";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var message = F5(function (sz,
   h,
   txtSize,
   bg,
   s) {
      return Graphics.Element.color(bg)(A3(Graphics.Element.container,
      sz,
      sz,
      A2(Graphics.Element.midTopAt,
      Graphics.Element.relative(0.5),
      Graphics.Element.relative(h)))(Graphics.Element.width(sz)(Text.centered(Text.bold(Text.color(Color.charcoal)(Text.height(Basics.toFloat(sz) * txtSize)(Text.bold(Text.toText(s)))))))));
   });
   _elm.Style.values = {_op: _op
                       ,message: message};
   return _elm.Style.values;
};