//var str = """var a = 3, b = 4, foo = function(x, y) { return x ** 2 + y ** 2 };println(foo(a, b));"""
//var str = "var a = 3, b = 4, foo = function(x, y) { return x ** 2 + y ** 2 };println(foo(a, b));"
//var str = "var a = 3, b = 4, foo = function(x, y) { return x ** 2 + y ** 2 };return(foo(a, b));"
var str = "2"
function test() {
    print(eval(str));
}
test();

// these both work in online javascript interpreters:
// alert(eval("var myarr = new Array(); myarr[Math.pow(2,32)-2]='hi'; myarr[Math.pow(2,32)-2]"));
// alert(eval("2"));