Elm.Main = Elm.Main || {};
Elm.Main.make = function (_elm) {
   "use strict";
   _elm.Main = _elm.Main || {};
   if (_elm.Main.values)
   return _elm.Main.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _E = _N.Error.make(_elm),
   _J = _N.JavaScript.make(_elm),
   $moduleName = "Main";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
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
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Random = Elm.Random.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var Window = Elm.Window.make(_elm);
   var _op = {};
   var on = F4(function (f,g,x,y) {
      return A2(f,g(x),g(y));
   });
   var transpose = function (mat) {
      return function () {
         var heads = function (xxs) {
            return A2(List.any,
            List.isEmpty,
            xxs) ? _J.toList([]) : A2(List.map,
            List.head,
            xxs);
         };
         return function () {
            var _v0 = heads(mat);
            switch (_v0.ctor)
            {case "[]":
               return _J.toList([]);}
            return {ctor: "::"
                   ,_0: _v0
                   ,_1: transpose(A2(List.map,
                   List.tail,
                   mat))};
         }();
      }();
   };
   var restartS = Graphics.Input.input({ctor: "_Tuple0"});
   var None = {ctor: "None"};
   var Down = {ctor: "Down"};
   var Up = {ctor: "Up"};
   var Right = {ctor: "Right"};
   var Left = {ctor: "Left"};
   var arrowToDir = function (_v1) {
      return function () {
         return function () {
            var _v3 = {ctor: "_Tuple2"
                      ,_0: _v1.x
                      ,_1: _v1.y};
            switch (_v3.ctor)
            {case "_Tuple2": switch (_v3._0)
                 {case -1: switch (_v3._1)
                      {case 0: return Left;}
                      break;
                    case 0: switch (_v3._1)
                      {case -1: return Down;
                         case 1: return Up;}
                      break;
                    case 1: switch (_v3._1)
                      {case 0: return Right;}
                      break;}
                 break;}
            return None;
         }();
      }();
   };
   var kbd = A2(Signal.dropWhen,
   A2(Signal._op["<~"],
   List.isEmpty,
   Keyboard.keysDown),
   None)(A2(Signal._op["<~"],
   arrowToDir,
   Keyboard.arrows));
   var Restart = function (a) {
      return {ctor: "Restart"
             ,_0: a};
   };
   var Slide = F2(function (a,b) {
      return {ctor: "Slide"
             ,_0: a
             ,_1: b};
   });
   var eventS = function () {
      var rangeMax = List.product(_L.range(1,
      16));
      var toRandInt = A2(Random.range,
      0,
      rangeMax);
      return Signal.merge(A2(Signal._op["<~"],
      Restart,
      toRandInt(restartS.signal)))(A2(Signal._op["~"],
      A2(Signal._op["<~"],Slide,kbd),
      toRandInt(kbd)));
   }();
   var startBoard = List.isEmpty;
   var Numbered = function (a) {
      return {ctor: "Numbered"
             ,_0: a};
   };
   var getNum = function (_v6) {
      return function () {
         switch (_v6.ctor)
         {case "Numbered":
            return _v6._0;}
         _E.Case($moduleName,
         "on line 35, column 23 to 24");
      }();
   };
   var Blank = {ctor: "Blank"};
   var defaultBoard = List.repeat(4)(List.repeat(4)(Blank));
   var isBlank = function (tile) {
      return function () {
         switch (tile.ctor)
         {case "Blank": return true;}
         return false;
      }();
   };
   var rowPoints = F2(function (old,
   $new) {
      return function () {
         var go = F2(function (olds,
         news) {
            return function () {
               var _v10 = {ctor: "_Tuple2"
                          ,_0: olds
                          ,_1: news};
               switch (_v10.ctor)
               {case "_Tuple2":
                  switch (_v10._0.ctor)
                    {case "::":
                       switch (_v10._0._1.ctor)
                         {case "::":
                            switch (_v10._1.ctor)
                              {case "::":
                                 return _U.eq(_v10._0._0 + _v10._0._1._0,
                                   _v10._1._0) ? _v10._1._0 + A2(go,
                                   _v10._0._1._1,
                                   _v10._1._1) : _U.eq(_v10._0._0,
                                   _v10._1._0) ? A2(go,
                                   {ctor: "::"
                                   ,_0: _v10._0._1._0
                                   ,_1: _v10._0._1._1},
                                   _v10._1._1) : -9999999;}
                              break;}
                         break;}
                    break;}
               return 0;
            }();
         });
         var sort$ = function (ts) {
            return List.sort(List.map(getNum)(A2(List.filter,
            function ($) {
               return Basics.not(isBlank($));
            },
            ts)));
         };
         return function () {
            var _v19 = {ctor: "_Tuple2"
                       ,_0: sort$(old)
                       ,_1: sort$($new)};
            switch (_v19.ctor)
            {case "_Tuple2": return A2(go,
                 _v19._0,
                 _v19._1);}
            _E.Case($moduleName,
            "on line 56, column 8 to 59");
         }();
      }();
   });
   var slideRow = function (ts) {
      return function () {
         var combine = function (ns) {
            return function () {
               switch (ns.ctor)
               {case "::": switch (ns._0.ctor)
                    {case "Numbered":
                       switch (ns._1.ctor)
                         {case "::":
                            switch (ns._1._0.ctor)
                              {case "Numbered":
                                 return _U.eq(ns._0._0,
                                   ns._1._0._0) ? _L.append({ctor: "::"
                                                            ,_0: Numbered(ns._0._0 + ns._1._0._0)
                                                            ,_1: combine(ns._1._1)},
                                   _J.toList([Blank])) : {ctor: "::"
                                                         ,_0: Numbered(ns._0._0)
                                                         ,_1: combine({ctor: "::"
                                                                      ,_0: Numbered(ns._1._0._0)
                                                                      ,_1: ns._1._1})};}
                              break;}
                         break;}
                    break;}
               return ns;
            }();
         };
         var $ = A2(List.partition,
         isBlank,
         ts),
         blanks = $._0,
         ns = $._1;
         return _L.append(combine(ns),
         blanks);
      }();
   };
   var slide = function (dir) {
      return function () {
         switch (dir.ctor)
         {case "Down":
            return function ($) {
                 return transpose(List.map(function ($) {
                    return List.reverse(slideRow(List.reverse($)));
                 })(transpose($)));
              };
            case "Left":
            return List.map(slideRow);
            case "Right":
            return List.map(function ($) {
                 return List.reverse(slideRow(List.reverse($)));
              });
            case "Up": return function ($) {
                 return transpose(List.map(slideRow)(transpose($)));
              };}
         return Basics.id;
      }();
   };
   var gameOver = function (brd) {
      return _U.eq(A2(slide,
      Down,
      brd),
      A2(slide,
      Up,
      brd)) && (_U.eq(A2(slide,
      Left,
      brd),
      A2(slide,
      Right,
      brd)) && _U.eq(A2(slide,
      Left,
      brd),
      brd));
   };
   var addTile = F2(function (rand,
   brd) {
      return function () {
         var countBlanks = A2(List.foldl,
         F2(function (t,sum) {
            return isBlank(t) ? 1 + sum : sum;
         }),
         0);
         var idx = A2(Basics.mod,
         rand,
         List.sum(A2(List.map,
         countBlanks,
         brd)));
         var modPow = F3(function (m,
         base,
         exp) {
            return _U.eq(exp,
            0) ? A2(Basics.mod,
            base,
            m) : A2(Basics.mod,
            base * A3(modPow,
            m,
            base,
            exp - 1),
            m);
         });
         var newTile = Numbered(_U.cmp(A3(modPow,
         19,
         rand,
         idx),
         4) < 0 ? 4 : 2);
         var replaceInRow = F2(function (i,
         _v30) {
            return function () {
               switch (_v30.ctor)
               {case "::": return function () {
                       var _v34 = {ctor: "_Tuple2"
                                  ,_0: i
                                  ,_1: _v30._0};
                       switch (_v34.ctor)
                       {case "_Tuple2":
                          switch (_v34._0)
                            {case 0: switch (_v34._1.ctor)
                                 {case "Blank":
                                    return {ctor: "::"
                                           ,_0: newTile
                                           ,_1: _v30._1};}
                                 break;}
                            switch (_v34._1.ctor)
                            {case "Blank":
                               return {ctor: "::"
                                      ,_0: Blank
                                      ,_1: A2(replaceInRow,
                                      _v34._0 - 1,
                                      _v30._1)};}
                            break;}
                       return {ctor: "::"
                              ,_0: _v30._0
                              ,_1: A2(replaceInRow,
                              i,
                              _v30._1)};
                    }();}
               _E.Case($moduleName,
               "between lines 112 and 116");
            }();
         });
         var replace = F2(function (i,
         _v37) {
            return function () {
               switch (_v37.ctor)
               {case "::": return function () {
                       var blanks = countBlanks(_v37._0);
                       return _U.cmp(i,
                       blanks) < 0 ? {ctor: "::"
                                     ,_0: A2(replaceInRow,i,_v37._0)
                                     ,_1: _v37._1} : {ctor: "::"
                                                     ,_0: _v37._0
                                                     ,_1: A2(replace,
                                                     i - blanks,
                                                     _v37._1)};
                    }();}
               _E.Case($moduleName,
               "between lines 107 and 110");
            }();
         });
         return A2(replace,idx,brd);
      }();
   });
   var stepGame = F2(function (_v41,
   _v42) {
      return function () {
         return function () {
            switch (_v41.ctor)
            {case "_Tuple2":
               return function () {
                    var trans = function () {
                       switch (_v41._0.ctor)
                       {case "Down": return transpose;
                          case "Up": return transpose;}
                       return Basics.id;
                    }();
                    var newBrd = startBoard(_v42.brd) ? A2(addTile,
                    _v41._1,
                    defaultBoard) : A2(slide,
                    _v41._0,
                    _v42.brd);
                    var points = List.sum(A2(A2(on,
                    List.zipWith(rowPoints),
                    trans),
                    _v42.brd,
                    newBrd));
                    return _U.eq(newBrd,
                    _v42.brd) ? _v42 : _U.replace([["brd"
                                                   ,A2(addTile,_v41._1,newBrd)]
                                                  ,["score"
                                                   ,_v42.score + points]],
                    _v42);
                 }();}
            _E.Case($moduleName,
            "between lines 87 and 97");
         }();
      }();
   });
   var step = function (ev) {
      return function () {
         switch (ev.ctor)
         {case "Restart":
            return function () {
                 var brd = addTile(ev._0)(addTile(ev._0)(defaultBoard));
                 return function (_v52) {
                    return function () {
                       return {_: {}
                              ,brd: brd
                              ,score: 0};
                    }();
                 };
              }();
            case "Slide":
            return stepGame({ctor: "_Tuple2"
                            ,_0: ev._0
                            ,_1: ev._1});}
         _E.Case($moduleName,
         "between lines 79 and 83");
      }();
   };
   var Game = F2(function (a,b) {
      return {_: {}
             ,brd: a
             ,score: b};
   });
   var tileCount = 4;
   var borderWidth = 10;
   var $ = {ctor: "_Tuple2"
           ,_0: 400
           ,_1: 400},
   width = $._0,
   height = $._1;
   var tileWidth = (width - (tileCount + 1) * borderWidth) / tileCount | 0;
   var tileHeight = (height - (tileCount + 1) * borderWidth) / tileCount | 0;
   var $ = {ctor: "_Tuple2"
           ,_0: tileWidth + borderWidth
           ,_1: tileHeight + borderWidth},
   frameWidth = $._0,
   frameHeight = $._1;
   var showTile = function (t) {
      return function () {
         var bgColor = function (n) {
            return A4(Color.Color,
            128 + Basics.min(256)((n / 8 | 0) * 16) - (n / 64 | 0) * 6,
            128 + (n / 32 | 0) * 10,
            128 + (n / 128 | 0) * 15,
            1);
         };
         var fontHeight = function (n) {
            return Basics.toFloat(tileHeight) / (1.5 + Basics.toFloat(String.length(String.show(n))) * 0.5);
         };
         return function () {
            switch (t.ctor)
            {case "Blank":
               return Graphics.Element.color(Color.darkGrey)(A2(Graphics.Element.size,
                 tileWidth,
                 tileHeight)(Graphics.Element.empty));
               case "Numbered":
               return Graphics.Element.color(bgColor(t._0))(A3(Graphics.Element.container,
                 tileWidth,
                 tileHeight,
                 Graphics.Element.middle)(Text.centered(Text.bold(Text.color(Color.charcoal)(Text.monospace(Text.height(fontHeight(t._0))(Text.toText(String.show(t._0)))))))));}
            _E.Case($moduleName,
            "between lines 152 and 159");
         }();
      }();
   };
   var showBoard = function (brd) {
      return function () {
         var frameTile = A3(Graphics.Element.container,
         frameWidth,
         frameHeight,
         Graphics.Element.middle);
         var rowToForm = function (row) {
            return Graphics.Element.flow(Graphics.Element.right)(A2(List.map,
            function ($) {
               return frameTile(showTile($));
            },
            row));
         };
         return A3(Graphics.Element.container,
         width,
         height,
         Graphics.Element.middle)(Graphics.Element.flow(Graphics.Element.down)(A2(List.map,
         rowToForm,
         brd)));
      }();
   };
   var gameOverElement = Graphics.Element.opacity(0.7)(Graphics.Element.color(Color.lightGrey)(A3(Graphics.Element.container,
   width,
   height,
   A2(Graphics.Element.midTopAt,
   Graphics.Element.relative(0.5),
   Graphics.Element.relative(0.3)))(Text.centered(Text.height(35)(Text.bold(Text.toText("GAME OVER")))))));
   var render = F2(function (_v56,
   _v57) {
      return function () {
         return function () {
            switch (_v56.ctor)
            {case "_Tuple2":
               return function () {
                    var frame = A2(Graphics.Element.container,
                    width,
                    height + 40);
                    var restart = A2(Graphics.Input.clickable,
                    restartS.handle,
                    {ctor: "_Tuple0"})(Graphics.Element.layers(_J.toList([Graphics.Element.color(Color.lightCharcoal)(A3(Graphics.Element.container,
                                                                         100,
                                                                         35,
                                                                         Graphics.Element.middle)(Text.centered(Text.height(25)(Text.toText("Restart")))))
                                                                         ,A2(Graphics.Element.spacer,
                                                                         100,
                                                                         35)])));
                    var scoreElem = Text.rightAligned(Text.height(25)(Text.toText(_L.append("Score: ",
                    String.show(_v57.score)))));
                    var board = startBoard(_v57.brd) ? A3(Graphics.Element.container,
                    width,
                    height,
                    Graphics.Element.middle)(Text.plainText("Press Any Arrow Key to Start")) : gameOver(_v57.brd) ? Graphics.Element.layers(_J.toList([showBoard(_v57.brd)
                                                                                                                                                      ,gameOverElement])) : showBoard(_v57.brd);
                    return A3(Graphics.Element.container,
                    _v56._0 - 10,
                    _v56._1 - 10,
                    Graphics.Element.middle)(Graphics.Element.layers(_J.toList([frame(Graphics.Element.midBottom)(A2(Graphics.Element.color,
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
            "between lines 175 and 191");
         }();
      }();
   });
   var main = A2(Signal._op["~"],
   A2(Signal._op["<~"],
   render,
   Window.dimensions),
   A3(Signal.foldp,
   step,
   {_: {}
   ,brd: _J.toList([])
   ,score: 0},
   eventS));
   var Hole = {ctor: "Hole"};
   _elm.Main.values = {_op: _op
                      ,height: height
                      ,width: width
                      ,borderWidth: borderWidth
                      ,tileCount: tileCount
                      ,tileWidth: tileWidth
                      ,tileHeight: tileHeight
                      ,frameHeight: frameHeight
                      ,frameWidth: frameWidth
                      ,defaultBoard: defaultBoard
                      ,isBlank: isBlank
                      ,getNum: getNum
                      ,startBoard: startBoard
                      ,gameOver: gameOver
                      ,rowPoints: rowPoints
                      ,slideRow: slideRow
                      ,slide: slide
                      ,step: step
                      ,stepGame: stepGame
                      ,addTile: addTile
                      ,eventS: eventS
                      ,restartS: restartS
                      ,arrowToDir: arrowToDir
                      ,kbd: kbd
                      ,showTile: showTile
                      ,showBoard: showBoard
                      ,gameOverElement: gameOverElement
                      ,render: render
                      ,main: main
                      ,transpose: transpose
                      ,on: on
                      ,Hole: Hole
                      ,Blank: Blank
                      ,Numbered: Numbered
                      ,Slide: Slide
                      ,Restart: Restart
                      ,Left: Left
                      ,Right: Right
                      ,Up: Up
                      ,Down: Down
                      ,None: None
                      ,Game: Game};
   return _elm.Main.values;
};