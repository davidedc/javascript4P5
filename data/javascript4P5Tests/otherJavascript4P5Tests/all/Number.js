var bigNumberOutsideIntegerRange = Math.pow(2,31) + 1;
print("2147483648 (number outside 32-bits integer range) :" + bigNumberOutsideIntegerRange + "\n")
print("\n");

print("about to initiate half as 1/2\n");
var half = 1/2;
print("this should show 0.5: " + half+ "\n");
var one = half + half;
print("this should show 1: " + one+ "\n");
print("\n");

print("about to initiate half as 0.5\n");
var anotherHalf = 0.5;
print("this should show 0.5: " + anotherHalf+ "\n");
var one = half + half;
print("this should show 1: " + anotherHalf+ "\n");
