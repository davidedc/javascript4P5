/*
javascript4P5 is a port of javascript4me for Processing, by Davide Della Casa
 javascript4me is made by Wang Lei ( rockswang@gmail.com ) and is released under GNU Lesser GPL
 You can find javascript4me at http://code.google.com/p/javascript4me/
 */

List list = null;
Pack dispStack = new Pack(-1, 3);
RocksInterpreter ri;
boolean stopSkippingTests = true;



protected void startApp() {
}

String[] lines;

void setup() {

  Vector sketchesInSketchesDirectory = null;
  Vector testSuites = null;


  try {
    testSuites = new FileUtils().nonRecursivelyListDirectoriesInside( new File(dataPath("") + "/javascript4P5Tests"));
  }
  catch (Exception e) {
    println(e);
  }
  println("//////////////////////////////");
  println("Running all the "+ testSuites.size()+" testsuites:");

  for (int k = 0; k < testSuites.size(); k++) {

    // we figure out the name of the sketch, it's the name of the deepest
    // directory in the path, so we get it with a little string
    // manipulation.
    String[] allDirectoriesInPath = testSuites.get(k).toString().split("\\/");
    String testSuiteName = allDirectoriesInPath[allDirectoriesInPath.length-1];

    if (testSuiteName.equals( "CVS") || testSuiteName.equals( ".DS_Store") ) {
      continue;
    }

    println("test suite: " + testSuiteName);

    Vector testCategories = null;


    try {
      testCategories = new FileUtils().nonRecursivelyListDirectoriesInside( new File(dataPath("") + "/javascript4P5Tests/"+testSuiteName));
    }
    catch (Exception e) {
      println(e);
    }
    println("   for all the "+ testCategories.size()+" categories:");

    for (int l = 0; l < testCategories.size(); l++) {

      // we figure out the name of the sketch, it's the name of the deepest
      // directory in the path, so we get it with a little string
      // manipulation.
      String[] allSubDirectoriesInPath = testCategories.get(l).toString().split("\\/");
      String testCategoryName = allSubDirectoriesInPath[allSubDirectoriesInPath.length-1];

      if (testCategoryName.equals( "CVS") || testCategoryName.equals( ".DS_Store") ) {
        continue;
      }

      println("    > category: " + testCategoryName);

      Vector finalTestFiles = null;
      try {
        finalTestFiles = new FileUtils().nonRecursivelyListFilesInside( new File(dataPath("") + "/javascript4P5Tests/"+testSuiteName + "/" + testCategoryName) );
      }
      catch (Exception e) {
        println(e);
      }

      for (int m = 0; m < finalTestFiles.size(); m++) {

        // we figure out the name of the sketch, it's the name of the deepest
        // directory in the path, so we get it with a little string
        // manipulation.
        String[] allTestsInPath = finalTestFiles.get(m).toString().split("\\/");
        String testName = allTestsInPath[allTestsInPath.length-1];
        if (testName.equals( "CVS") || testName.equals( ".DS_Store") || testName.equals( "README") || testName.equals( "browser.js") || testName.equals(  "shell.js") || testName.equals(  "browser.js")  || testName.equals(  "template.js")  || testName.equals(  "jsref.js")) {
          continue;
        }
        println("                      > " + testSuiteName + " - " + testCategoryName + " - " +testName);

        // ok here we build the final file to be ran
        // it comprises of the testuite shell.js and jsref.js files, plus the testcategory shell.js file, plus the test file

        /*
        if (
           (testName.equals("regress-159334.js") && testSuiteName.equals("js1_5") && testCategoryName.equals("Regress"))
        ) {
          stopSkippingTests = true;
        }
        */

        if (
           (testName.equals("11.3.1.js") && testSuiteName.equals("ecma") && testCategoryName.equals("Expressions"))
        ||
           (testName.equals("11.3.2.js") && testSuiteName.equals("ecma") && testCategoryName.equals("Expressions"))
        ||
           (testName.equals("11.4.4.js") && testSuiteName.equals("ecma") && testCategoryName.equals("Expressions"))
        ||
           (testName.equals("11.4.5.js") && testSuiteName.equals("ecma") && testCategoryName.equals("Expressions"))
        ||
           (testName.equals("forin-002.js") && testSuiteName.equals("ecma_2") && testCategoryName.equals("Statements"))
        ||
           (testName.equals("array-001.js") && testSuiteName.equals("js1_5") && testCategoryName.equals("Array"))
        ||
           (testName.equals("regress-121658.js") && testSuiteName.equals("js1_5") && testCategoryName.equals("Exceptions"))
        ||
           (testName.equals("regress-111557.js") && testSuiteName.equals("js1_5") && testCategoryName.equals("Regress"))
        ||
           (testName.equals("regress-155081-2.js") && testSuiteName.equals("js1_5") && testCategoryName.equals("Regress"))
        ||
           (testName.equals("regress-155081.js") && testSuiteName.equals("js1_5") && testCategoryName.equals("Regress"))
        ||
           (testName.equals("regress-159334.js") && testSuiteName.equals("js1_5") && testCategoryName.equals("Regress"))
        ) {
          println("...skipping, moving on to next one.");
          continue;
        }


        if (!stopSkippingTests) continue;
        
        String testSuiteShellJS = new FileUtils().loadFileAsString(new File(dataPath("") + "/javascript4P5Tests/"+testSuiteName + "/shell.js"));
        String testSuiteJsrefJS = new FileUtils().loadFileAsString(new File(dataPath("") + "/javascript4P5Tests/"+testSuiteName + "/jsref.js"));
        String testCategoryShellJS = new FileUtils().loadFileAsString( new File(dataPath("") + "/javascript4P5Tests/"+testSuiteName + "/" + testCategoryName + "/shell.js") );
        String testJS = new FileUtils().loadFileAsString( new File(dataPath("") + "/javascript4P5Tests/"+testSuiteName + "/" + testCategoryName + "/" + testName) );
        //String finalTest = "// ### testSuiteShellJS\n" + testSuiteShellJS + "\n"+ "// ### testSuiteJsrefJS\n" + testSuiteJsrefJS + "\n"+ "// ### testCategoryShellJS\n" + testCategoryShellJS + "\n"+ "// ### testJS\n" + testJS + "\n";
        String finalTest = "// ### testSuiteJsrefJS\n" + testSuiteJsrefJS + "\n"+ "// ### testCategoryShellJS\n" + testCategoryShellJS + "\n"+ "// ### testJS\n" + testJS + "\n";

        //println( finalTest);
        //if(1==1) return;

        try {
          if (ri == null) {
            ri = new RocksInterpreter(finalTest, null, 0, finalTest.length());
            ri.evalString = true;
            ri.DEBUG = false;
          } 
          else {
            ri.reset(finalTest, null, 0, finalTest.length());
          }
          ri.out.setLength(0);
          long start = System.currentTimeMillis();
          Node func = ri.astNode(null, '{', 0, 0);
          ri.astNode(func, '{', 0, ri.endpos);
          Rv rv = new Rv(false, func, 0);
          Rv callObj = rv.co = ri.initGlobalObject();
          ri.call(false, rv, callObj, null, null, 0, 0);
          int time = (int) (System.currentTimeMillis() - start);

          //println(">> Execution completed in " + time + " ms <<\n");
        }
        catch (Exception e) {
          println(">> Exception: " + e);
        }
      }
    }
  }
}

static final byte[] readData(InputStream is) throws Exception {
  ByteArrayOutputStream bos = new ByteArrayOutputStream();
  byte[] bb = new byte[2000];
  int len;
  while ( (len = is.read (bb)) > 0) {
    bos.write(bb, 0, len);
  }
  return bos.toByteArray();
}

public static final String readUTF(byte[] data) {
  byte[] bb = new byte[data.length + 2];
  System.arraycopy(data, 0, bb, 2, data.length);
  bb[0] = (byte) (data.length >> 8);
  bb[1] = (byte) data.length;
  DataInputStream dis = new DataInputStream(new ByteArrayInputStream(bb));
  String ret = null;
  try {
    ret = dis.readUTF();
    //if (ret.charAt(0) == '\uFEFF') { // remove BOM
    //    ret = ret.substring(1);
    //}
  } 
  catch (Exception ex) {
    ex.printStackTrace();
  }
  return ret;
}

