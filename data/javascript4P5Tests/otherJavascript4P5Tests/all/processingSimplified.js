  // leave the spacing of the line below EXACTLY as is
  // cause we are substituting the string
  // exactly as written to change the flag to true
  var runningWithJavascript4PE = false;

  // also note that in the case of javascript4P5 these two are respectively
  // transformed in /* and */
  // this is because just the attempt to parse the regular expressions in javasript4P5
  // hangs the interpreter. By commenting it, the interpreter continues
  // happily.
         /*comment-in for javascript4P5*/
         /*comment-out for javascript4P5*/


var processingJSDebug = function(stringToOutput){
	if (runningWithJavascript4PE){
	  println(stringToOutput);
	}
	else {
		document.getElementById('processingJSDebug').value = document.getElementById('processingJSDebug').value + stringToOutput + "\n";
	}
}


  if (runningWithJavascript4PE)
  processingJSDebug("running from javascript interpreter javascript4p5");


  var Processing = this.Processing = []; // Processing() ends

  // Processing global methods and constants for the parser
  function getGlobalMembers() {
    // The names array contains the names of everything that is inside "p."
    // When something new is added to "p." it must also be added to this list.
    var names = [ "line", "println"];

    var members = {};
    var i, l;
    for (i = 0, l = names.length; i < l ; ++i) {
      members[names[i]] = null;
    }
    return members;
  }

//    Parser converts Java-like syntax into JavaScript.

  function parseProcessing(code) {
    var globalMembers = getGlobalMembers();

    // masks parentheses, brackets and braces with '"A5"'
    // where A is the bracket type, and 5 is the index in an array containing all brackets split into atoms
    // 'while(true){}' -> 'while"B1""A2"'
    // parentheses() = B, brackets[] = C and braces{} = A
    function splitToAtoms(code) {
      var atoms = [];
			processingJSDebug("#regextofix 1");
			processingJSDebug("code: " + code);
      //#regextofix 1
      //var items = code.split(/([\{\[\(\)\]\}])/);
      //var items = code.split("/([\s])/");
      var items;
      if (runningWithJavascript4PE)
         items = code.javaSplit("/([@{@[@(@)@]@}])/");
      else {
         /*comment-in for javascript4P5*/
         items = code.split(/([\{\[\(\)\]\}])/);
         /*comment-out for javascript4P5*/
         }
      //var items = code.javaSplit("/([@s])/");
      // this one below doesn't work, probably due to preprocessing
      // of the interpreter, the \\ doesn't go through...
      //var items = code.javaSplit("/([\\s])/");
      
					/*
					// by Davide Della Casa (sigh)
					// taken from http://scottdowne.wordpress.com/2010/07/13/javascript-array-split-on-multiple-characters/
					// horrible horrible replacement of:
					// var items = code.split(/([\{\[\(\)\]\}])/);
					// that uses only the 1-char at a time naive split
					// (this was the first attempt)
					var array = code.split("{");
						  println("array[0]: " + array[0]);
					var finishedArray = [];
					for ( i = 0, il = array.length; i < il; i++) {
						  println("1");
					  var temp = array[i].split("[");
						  println("temp length " + temp.length);
						  //return;
					  for (var j = 0, jl = temp.length; j < jl; j++) {
						  println("j: " + j);
						  println("temp[j]: " + temp[j]);
						finishedArray.push(temp[j]);
						  println("finishedArray[j]: " + finishedArray[j]);
					  }
					}
					array = finishedArray;
						  println("array[0]: " + array[0]);
					finishedArray = [];
					for ( i = 0, il = array.length; i < il; i++) {
					  var temp = array[i].split("(");
						  println("temp length " + temp.length);
					  for ( j = 0, jl = temp.length; j < jl; j++) {
						  println("j: " + j);
						  println("temp[j]: " + temp[j]);
						finishedArray.push(temp[j]);
						  println("finishedArray[j]: " + finishedArray[j]);
					  }
					}
					array = finishedArray;
						  println("array[0]2: " + array[0]);
					finishedArray = [];
					for ( i = 0, il = array.length; i < il; i++) {
					  var temp = array[i].split(")");
					  for ( j = 0, jl = temp.length; j < jl; j++) {
						finishedArray.push(temp[j]);
					  }
					}
					array = finishedArray;
						  println("array[0]: " + array[0]);
					finishedArray = [];
					for ( i = 0, il = array.length; i < il; i++) {
					  var temp = array[i].split("]");
					  for ( j = 0, jl = temp.length; j < jl; j++) {
						finishedArray.push(temp[j]);
					  }
					}
					array = finishedArray;
						  println("array[0]: " + array[0]);
					finishedArray = [];
					for ( i = 0, il = array.length; i < il; i++) {
					  var temp = array[i].split("}");
					  for ( j = 0, jl = temp.length; j < jl; j++) {
						finishedArray.push(temp[j]);
					  }
					}
					
					var items = finishedArray;
					// end of horrible horrible replacement
					*/

      
      var result = items[0];
        processingJSDebug("items[0]: " + items[0]);

      var stack = [];
      for(var i=1; i < items.length; i += 2) {
        var item = items[i];
        if(item === '[' || item === '{' || item === '(') {
          stack.push(result); result = item;
        } else if(item === ']' || item === '}' || item === ')') {
          var kind = item === '}' ? 'A' : item === ')' ? 'B' : 'C';
          var index = atoms.length; atoms.push(result + item);
          result = stack.pop() + '"' + kind + (index + 1) + '"';
        }
        result += items[i + 1];
      }
      atoms.unshift(result);
      return atoms;
    }

    // replaces strings and regexs keyed by index with an array of strings
    function injectStrings(code, strings) {
      return code;
    }

    // trims off leading and trailing spaces
    // returns an object. object.left, object.middle, object.right, object.untrim
    function trimSpaces(string) {
      var m1 = /^\s*/.exec(string), result;
      if(m1[0].length === string.length) {
        result = {left: m1[0], middle: "", right: ""};
      } else {
        var m2 = /\s*$/.exec(string);
        result = {left: m1[0], middle: string.substring(m1[0].length, m2.index), right: m2[0]};
      }
      result.untrim = function(t) { return this.left + t + this.right; };
      return result;
    }

    // simple trim of leading and trailing spaces
    function trim(string) {
      return string;
    }

    function appendToLookupTable(table, array) {
      for(var i=0,l=array.length;i<l;++i) {
        table[array[i]] = null;
      }
      return table;
    }

    function isLookupTableEmpty(table) {
      return true;
    }

    function getAtomIndex(templ) { return templ.substring(2, templ.length - 1); }

    var codeWoExtraCr = code;

    // masks strings and regexs with "'5'", where 5 is the index in an array containing all strings and regexs
    // also removes all comments
    var strings = [];
    var codeWoStrings = codeWoExtraCr;

    // removes generics
    //var genericsWereRemoved;
    var codeWoGenerics = codeWoStrings;
    
    var atoms = splitToAtoms(codeWoGenerics);
    var replaceContext;
    var declaredClasses = {}, currentClassId, classIdSeed = 0;

    function addAtom(text, type) {
      var lastIndex = atoms.length;
      atoms.push(text);
      return '"' + type + lastIndex + '"';
    }

    function generateClassId() {
    }

    function appendClass(class_, classId, scopeId) {
    }

    // functions defined below
    var transformClassBody, transformInterfaceBody, transformStatementsBlock, transformStatements, transformMain, transformExpression;

    var classesRegex = "";
      processingJSDebug("#regextofix 2");
    //#regextofix 2
    if (!runningWithJavascript4PE) {
         /*comment-in for javascript4P5*/
     var methodsRegex = /\b((?:(?:public|private|final|protected|static|abstract|synchronized)\s+)*)((?!(?:else|new|return|throw|function|public|private|protected)\b)[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*(?:\s*"C\d+")*)\s*([A-Za-z_$][\w$]*\b)\s*("B\d+")(\s*throws\s+[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*(?:\s*,\s*[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*)*)?\s*("A\d+"|;)/g;
     var fieldTest = /^((?:(?:public|private|final|protected|static)\s+)*)((?!(?:else|new|return|throw)\b)[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*(?:\s*"C\d+")*)\s*([A-Za-z_$][\w$]*\b)\s*(?:"C\d+"\s*)*([=,]|$)/;
         /*comment-out for javascript4P5*/
    }
    var cstrsRegex = "";
    if (!runningWithJavascript4PE) {
         /*comment-in for javascript4P5*/
      var attrAndTypeRegex = /^((?:(?:public|private|final|protected|static)\s+)*)((?!(?:new|return|throw)\b)[A-Za-z_$][\w$]*\b(?:\s*\.\s*[A-Za-z_$][\w$]*\b)*(?:\s*"C\d+")*)\s*/;
         /*comment-out for javascript4P5*/
    }
    var functionsRegex = "";

    // This converts classes, methods and functions into atoms, and adds them to the atoms array.
    // classes = E, methods = D and functions = H
    function extractClassesAndMethods(code) {
      var s = code;
      s = s.replace(methodsRegex, function(all) {
        return addAtom(all, 'D');
      });
      return s;
    }

    // This converts constructors into atoms, and adds them to the atoms array.
    // constructors = G
    function extractConstructors(code, className) {
      return code;
    }

    // AstParam contains the name of a parameter inside a function declaration
    function AstParam(name) {
    }
    AstParam.prototype.toString = function() {
    };
    // AstParams contains an array of AstParam objects
    function AstParams(params) {
      this.params = params;
    }
    AstParams.prototype.getNames = function() {
      var names = [];
      return names;
    };
    AstParams.prototype.toString = function() {
        return "()";
    };

    function transformParams(params) {
      return new AstParams([]);
    }

    function preExpressionTransform(expr) {
      return expr;
    }


    function AstFunction(name, params, body) {
    }
    AstFunction.prototype.toString = function() {
    };

    function transformFunction(class_) {
    }

    function AstInlineObject(members) {
    }




    function expandExpression(expr) {
      var trimmed = trimSpaces(expr);
      var result = preExpressionTransform(trimmed.middle);
       processingJSDebug("#regextofix 3");
      //#regextofix 3
      if (!runningWithJavascript4PE) {
         /*comment-in for javascript4P5*/
		  result = result.replace(/"[ABC](\d+)"/g, function(all, index) {
			return expandExpression(atoms[index]);
		  });
         /*comment-out for javascript4P5*/
      }
      return trimmed.untrim(result);
    }

    function replaceContextInVars(expr) {
        processingJSDebug("#regextofix 4");
         if (!runningWithJavascript4PE) {
          //#regextofix 4
         /*comment-in for javascript4P5*/
		  return expr.replace(/(\.\s*)?((?:\b[A-Za-z_]|\$)[\w$]*)(\s*\.\s*([A-Za-z_$][\w$]*)(\s*\()?)?/g,
			function(all, memberAccessSign, identifier, suffix, subMember, callSign) {
			  if(memberAccessSign) {
				return all;
			  }
			  var subject = { name: identifier, member: subMember, callSign: !!callSign };
			  return replaceContext(subject) +  "";
			});
         /*comment-out for javascript4P5*/
        }
    }

    function AstExpression(expr, transforms) {
      this.expr = expr;
      this.transforms = transforms;
    }
    AstExpression.prototype.toString = function() {
      var transforms = this.transforms;
      var expr = replaceContextInVars(this.expr);
      return expr.replace(/"!(\d+)"/g, function(all, index) {
        return transforms[index].toString();
      });
    };

    transformExpression = function(expr) {
      var transforms = [];
      var s = expandExpression(expr);
      return new AstExpression(s, transforms);
    };

    function AstVarDefinition(name, value, isDefault) {
      this.name = name;
      this.value = value;
      this.isDefault = isDefault;
    }
    AstVarDefinition.prototype.toString = function() {
      return this.name + ' = ' + this.value;
    };

    function transformVarDefinition(def, defaultTypeValue) {
      var eqIndex = def.indexOf("=");
      var name, value, isDefault;
      if(eqIndex < 0) {
        name = def;
        value = defaultTypeValue;
        isDefault = true;
      } else {
        name = def.substring(0, eqIndex);
        value = transformExpression(def.substring(eqIndex + 1));
        isDefault = false;
      }
        processingJSDebug("#regextofix 5");
      //#regextofix 5
    if (!runningWithJavascript4PE) {
         /*comment-in for javascript4P5*/
      return new AstVarDefinition( trim(name.replace(/(\s*"C\d+")+/g, "")),
        value, isDefault);
         /*comment-out for javascript4P5*/
        }
    }

    function getDefaultValueForType(type) {
          return "0";
    }

    function AstVar(definitions, varType) {
      this.definitions = definitions;
      this.varType = varType;
    }
    AstVar.prototype.getNames = function() {
      var names = [];
      for(var i=0,l=this.definitions.length;i<l;++i) {
        names.push(this.definitions[i].name);
      }
      return names;
    };
    AstVar.prototype.toString = function() {
      return "var " + this.definitions.join(",");
    };
    function AstStatement(expression) {
      this.expression = expression;
    }
    AstStatement.prototype.toString = function() {
      return this.expression.toString();
    };

    function transformStatement(statement) {
      if(fieldTest.test(statement)) {
        var attrAndType = attrAndTypeRegex.exec(statement);
        var definitions = statement.substring(attrAndType[0].length).split(",");
        var defaultTypeValue = getDefaultValueForType(attrAndType[2]);
        for(var i=0; i < definitions.length; ++i) {
          definitions[i] = transformVarDefinition(definitions[i], defaultTypeValue);
        }
        return new AstVar(definitions, attrAndType[2]);
      }
      return new AstStatement(transformExpression(statement));
    }

    function AstForExpression(initStatement, condition, step) {
    }
    AstForExpression.prototype.toString = function() {
    };

    function AstForInExpression(initStatement, container) {
    }
    AstForInExpression.prototype.toString = function() {
    };

    function AstForEachExpression(initStatement, container) {
    }

    function transformForExpression(expr) {
    }

    function sortByWeight(array) {
    }

    function AstInnerInterface(name, body, isStatic) {
    }
    AstInnerInterface.prototype.toString = function() {
    };
    function AstInnerClass(name, body, isStatic) {
    }
    AstInnerClass.prototype.toString = function() {
    };

    function transformInnerClass(class_) {
    }

    function AstClassMethod(name, params, body, isStatic) {
    }
    AstClassMethod.prototype.toString = function(){
    };

    function transformClassMethod(method) {
    }

    function AstClassField(definitions, fieldType, isStatic) {
    }
    AstClassField.prototype.getNames = function() {
    };
    AstClassField.prototype.toString = function() {
    };

    function transformClassField(statement) {
    }

    function AstConstructor(params, body) {
    }
    AstConstructor.prototype.toString = function() {
    };

    function transformConstructor(cstr) {
    }

    function AstInterfaceBody(name, interfacesNames, methodsNames, fields, innerClasses, misc) {
    }

    AstInterfaceBody.prototype.toString = function() {

    };


    transformClassBody = function(body, name, baseName, interfaces) {
    };

    function AstInterface(name, body) {
    }
    AstInterface.prototype.toString = function() {
    };
    function AstClass(name, body) {
    }
    AstClass.prototype.toString = function() {
    };

    function transformGlobalClass(class_) {
    }

    function AstMethod(name, params, body) {
      this.name = name;
      this.params = params;
      this.body = body;
    }
    AstMethod.prototype.toString = function(){
      var paramNames = appendToLookupTable({}, this.params.getNames());
      var oldContext = replaceContext;
      replaceContext = function (subject) {
        return paramNames.hasOwnProperty(subject.name) ? subject.name : oldContext(subject);
      };
      var result = "function " + this.name + this.params + " " + this.body + "\n" +
        "$p." + this.name + " = " + this.name + ";";
      replaceContext = oldContext;
      return result;
    };

    function transformGlobalMethod(method) {
      var m = methodsRegex.exec(method);
      var result =
      methodsRegex.lastIndex = 0;
      return new AstMethod(m[3], transformParams(atoms[getAtomIndex(m[4])]),
        transformStatementsBlock(atoms[getAtomIndex(m[6])]));
    }

    function preStatementsTransform(statements) {
      return statements;
    }

    function AstForStatement(argument, misc) {
    }
    function AstCatchStatement(argument, misc) {
    }
    function AstPrefixStatement(name, argument, misc) {
    }
    function AstSwitchCase(expr) {
    }
    function AstLabel(label) {
    }

    transformStatements = function(statements, transformMethod, transformClass) {
        processingJSDebug("#regextofix 6");
      //#regextofix 6
      if (!runningWithJavascript4PE) {
         /*comment-in for javascript4P5*/
	    var nextStatement = new RegExp(/\b(catch|for|if|switch|while|with)\s*"B(\d+)"|\b(do|else|finally|return|throw|try|break|continue)\b|("[ADEH](\d+)")|\b(case)\s+([^:]+):|\b([A-Za-z_$][\w$]*\s*:)|(;)/g);
         /*comment-out for javascript4P5*/
	  }
      var res = [];
      statements = preStatementsTransform(statements);
      var lastIndex = 0, m, space;
      // m contains the matches from the nextStatement regexp, null if there are no matches.
      // nextStatement.exec starts searching at nextStatement.lastIndex.
      while((m = nextStatement.exec(statements)) !== null) {
		if(m[4] !== undefined) { // block, class and methods
          space = statements.substring(lastIndex, nextStatement.lastIndex - m[4].length);
          res.push(space);
          var kind = m[4].charAt(1), atomIndex = m[5];
          if(kind === 'D') {
            res.push(transformMethod(atoms[atomIndex]));
          } else if(kind === 'E') {
            res.push(transformClass(atoms[atomIndex]));
          } else if(kind === 'H') {
            res.push(transformFunction(atoms[atomIndex]));
          } else {
            res.push(transformStatementsBlock(atoms[atomIndex]));
          }
        } else { // semicolon
          var statement = trimSpaces(statements.substring(lastIndex, nextStatement.lastIndex - 1));
          res.push(statement.left);
          res.push(transformStatement(statement.middle));
          res.push(statement.right + ";");
        }
        lastIndex = nextStatement.lastIndex;
      }
      var statementsTail = trimSpaces(statements.substring(lastIndex));
      res.push(statementsTail.left);
      if(statementsTail.middle !== "") {
        res.push(transformStatement(statementsTail.middle));
        res.push(";" + statementsTail.right);
      }
      return res;
    };

    function getLocalNames(statements) {
      var localNames = [];
      for(var i=0,l=statements.length;i<l;++i) {
        var statement = statements[i];
        if(statement instanceof AstVar) {
          localNames = localNames.concat(statement.getNames());
        }
      }
      return appendToLookupTable({}, localNames);
    }

    function AstStatementsBlock(statements) {
      this.statements = statements;
    }
    AstStatementsBlock.prototype.toString = function() {
      var localNames = getLocalNames(this.statements);
      var oldContext = replaceContext;

      // replacing context only when necessary
      if(!isLookupTableEmpty(localNames)) {
        replaceContext = function (subject) {
          return localNames.hasOwnProperty(subject.name) ? subject.name : oldContext(subject);
        };
      }

      var result = "{\n" + this.statements.join('') + "\n}";
      replaceContext = oldContext;
      return result;
    };

    transformStatementsBlock = function(block) {
      var content = trimSpaces(block.substring(1, block.length - 1));
      return new AstStatementsBlock(transformStatements(content.middle));
    };

    function AstRoot(statements) {
      this.statements = statements;
    }
    AstRoot.prototype.toString = function() {
      var classes = [], otherStatements = [], statement;
      for (var i = 0, len = this.statements.length; i < len; ++i) {
        statement = this.statements[i];
          otherStatements.push(statement);
      }

      var localNames = getLocalNames(this.statements);
      replaceContext = function (subject) {
        var name = subject.name;
        if(localNames.hasOwnProperty(name)) {
          return name;
        }
        if(globalMembers.hasOwnProperty(name) ||
           PConstants.hasOwnProperty(name) ) {
          return "$p." + name;
        }
        return name;
      };
      var result = "// this code was autogenerated from PJS\n" +
        "(function($p) {\n" +
        classes.join('') + "\n" +
        otherStatements.join('') + "\n})";
      replaceContext = null;
      return result;
    };

    transformMain = function() {
      var statements = extractClassesAndMethods(atoms[0]);
      return new AstRoot( transformStatements(statements,
        transformGlobalMethod, transformGlobalClass) );
    };

    function generateMetadata(ast) {
    }

    function setWeight(ast) {}

    var transformed = transformMain();

    var redendered = transformed.toString();

    return injectStrings(redendered, strings);
  }// Parser ends

  function preprocessCode(aCode, sketch) {
    return aCode;
  }

  // Parse/compiles Processing (Java-like) syntax to JavaScript syntax
  Processing.compile = function(pdeCode) {
    //var sketch = new Processing.Sketch();
    //var code = preprocessCode(pdeCode, []);
    return parseProcessing(pdeCode);
    //sketch.sourceCode = compiledPde;
    //return sketch;
  };

	if (runningWithJavascript4PE){
		var exampleProgram01 = "int a=1;";
		processingJSDebug(exampleProgram01);
		processingJSDebug(parseProcessing(exampleProgram01));
	}

