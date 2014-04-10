Elm.Main = Elm.Main || {};
Elm.Main.make = function (_elm) {
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
   var Keyboard = Elm.Keyboard.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Prelude = Elm.Prelude.make(_elm);
   var Random = Elm.Random.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var Window = Elm.Window.make(_elm);
   var _op = {};
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
   var kbd = A3(Signal.dropWhen,
   A2(Signal._op["<~"],
   List.isEmpty,
   Keyboard.keysDown),
   {_: {},x: 0,y: 0},
   Keyboard.arrows);
   var event = function () {
      var rangeMax = List.product(_L.range(1,
      16));
      return A2(Signal.lift2,
      F2(function (v0,v1) {
         return {ctor: "_Tuple2"
                ,_0: v0
                ,_1: v1};
      }),
      kbd)(A3(Random.range,
      0,
      rangeMax,
      kbd));
   }();
   var Numbered = function (a) {
      return {ctor: "Numbered"
             ,_0: a};
   };
   var Blank = {ctor: "Blank"};
   var isBlank = function (t) {
      return function () {
         switch (t.ctor)
         {case "Blank": return true;}
         return false;
      }();
   };
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
   var slide = function (_v9) {
      return function () {
         return function () {
            var _v11 = {ctor: "_Tuple2"
                       ,_0: _v9.x
                       ,_1: _v9.y};
            switch (_v11.ctor)
            {case "_Tuple2":
               switch (_v11._0)
                 {case -1: switch (_v11._1)
                      {case 0:
                         return List.map(slideRow);}
                      break;
                    case 0: switch (_v11._1)
                      {case -1: return function ($) {
                              return transpose(List.map(function ($) {
                                 return List.reverse(slideRow(List.reverse($)));
                              })(transpose($)));
                           };
                         case 1: return function ($) {
                              return transpose(List.map(slideRow)(transpose($)));
                           };}
                      break;
                    case 1: switch (_v11._1)
                      {case 0:
                         return List.map(function ($) {
                              return List.reverse(slideRow(List.reverse($)));
                           });}
                      break;}
                 break;}
            return Basics.id;
         }();
      }();
   };
   var addTile = F3(function (i,
   $new,
   brd) {
      return function () {
         var replaceInRow = F2(function (i,
         _v14) {
            return function () {
               switch (_v14.ctor)
               {case "::": return function () {
                       var _v18 = {ctor: "_Tuple2"
                                  ,_0: i
                                  ,_1: _v14._0};
                       switch (_v18.ctor)
                       {case "_Tuple2":
                          switch (_v18._0)
                            {case 0: switch (_v18._1.ctor)
                                 {case "Blank":
                                    return {ctor: "::"
                                           ,_0: $new
                                           ,_1: _v14._1};}
                                 break;}
                            switch (_v18._1.ctor)
                            {case "Blank":
                               return {ctor: "::"
                                      ,_0: Blank
                                      ,_1: A2(replaceInRow,
                                      _v18._0 - 1,
                                      _v14._1)};}
                            break;}
                       return {ctor: "::"
                              ,_0: _v14._0
                              ,_1: A2(replaceInRow,
                              i,
                              _v14._1)};
                    }();}
               _E.Case($moduleName,
               "between lines 56 and 60");
            }();
         });
         var countBlanks = A2(List.foldl,
         F2(function (t,sum) {
            return isBlank(t) ? 1 + sum : sum;
         }),
         0);
         var idx = A2(Basics.mod,
         i,
         List.sum(A2(List.map,
         countBlanks,
         brd)));
         var replace = F2(function (i,
         _v21) {
            return function () {
               switch (_v21.ctor)
               {case "::": return function () {
                       var blanks = countBlanks(_v21._0);
                       return _U.cmp(i,
                       blanks) < 0 ? {ctor: "::"
                                     ,_0: A2(replaceInRow,i,_v21._0)
                                     ,_1: _v21._1} : {ctor: "::"
                                                     ,_0: _v21._0
                                                     ,_1: A2(replace,
                                                     i - blanks,
                                                     _v21._1)};
                    }();}
               _E.Case($moduleName,
               "between lines 51 and 54");
            }();
         });
         return A2(replace,idx,brd);
      }();
   });
   var defaultBoard = A2(addTile,
   2,
   Numbered(2))(A2(addTile,
   4,
   Numbered(2))(List.repeat(4)(List.repeat(4)(Blank))));
   var stepBoard = F2(function (_v25,
   brd) {
      return function () {
         switch (_v25.ctor)
         {case "_Tuple2":
            return function () {
                 var brd$ = A2(slide,
                 _v25._0,
                 brd);
                 var newTile = Numbered(_U.eq(A2(Basics.mod,
                 _v25._1,
                 4),
                 0) ? 4 : 2);
                 return _U.eq(brd$,
                 brd) ? brd : A3(addTile,
                 _v25._1,
                 newTile,
                 brd$);
              }();}
         _E.Case($moduleName,
         "between lines 42 and 45");
      }();
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
         var fontHeight = function (n) {
            return Basics.toFloat(tileHeight) / (1.5 + Basics.toFloat(String.length(Prelude.show(n))) * 0.5);
         };
         return function () {
            switch (t.ctor)
            {case "Blank":
               return Graphics.Element.color(Color.darkGrey)(A2(Graphics.Element.size,
                 tileWidth,
                 tileHeight)(Graphics.Element.empty));
               case "Numbered":
               return Graphics.Element.color(Color.grey)(A3(Graphics.Element.container,
                 tileWidth,
                 tileHeight,
                 Graphics.Element.middle)(Text.text(Text.bold(Text.color(Color.charcoal)(Text.monospace(Text.height(fontHeight(t._0))(Text.toText(Prelude.show(t._0)))))))));}
            _E.Case($moduleName,
            "between lines 74 and 81");
         }();
      }();
   };
   var render = F2(function (_v31,
   board) {
      return function () {
         switch (_v31.ctor)
         {case "_Tuple2":
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
                 var grid = A3(Graphics.Element.container,
                 width,
                 height,
                 Graphics.Element.middle)(Graphics.Element.flow(Graphics.Element.down)(A2(List.map,
                 rowToForm,
                 board)));
                 return A3(Graphics.Element.container,
                 _v31._0,
                 _v31._1,
                 Graphics.Element.middle)(Graphics.Element.color(Color.lightCharcoal)(grid));
              }();}
         _E.Case($moduleName,
         "between lines 85 and 89");
      }();
   });
   var main = A2(Signal._op["~"],
   A2(Signal._op["<~"],
   render,
   Window.dimensions),
   A3(Signal.foldp,
   stepBoard,
   defaultBoard,
   event));
   _elm.Main.values = {_op: _op
                      ,height: height
                      ,width: width
                      ,borderWidth: borderWidth
                      ,tileCount: tileCount
                      ,tileWidth: tileWidth
                      ,tileHeight: tileHeight
                      ,frameHeight: frameHeight
                      ,frameWidth: frameWidth
                      ,isBlank: isBlank
                      ,defaultBoard: defaultBoard
                      ,slideRow: slideRow
                      ,stepBoard: stepBoard
                      ,addTile: addTile
                      ,slide: slide
                      ,showTile: showTile
                      ,render: render
                      ,kbd: kbd
                      ,event: event
                      ,main: main
                      ,transpose: transpose
                      ,Blank: Blank
                      ,Numbered: Numbered};
   return _elm.Main.values;
};