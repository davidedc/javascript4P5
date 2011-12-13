/*
javascript4P5 is a port of javascript4me for Processing, by Davide Della Casa
javascript4me is made by Wang Lei ( rockswang@gmail.com ) and is released under GNU Lesser GPL
You can find javascript4me at http://code.google.com/p/javascript4me/
*/

    List list = null;
    // Form srcForm, resultForm; //removed
    Pack dispStack = new Pack(-1, 3);
    // Command runCmd, srcCmd, exitCmd, backCmd; //removed
    ZipMe zip = null;
    RocksInterpreter ri;
    


  
    protected void startApp()  {
      /*
        if (list == null) {
            list = new List("RockScript", List.EXCLUSIVE);
            InputStream is = "".getClass().getResourceAsStream("/scripts.zip");
            try {
                zip = new ZipMe(readData(is));
                is.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
            Pack scripts = zip.list();
            for (int i = 0; i < scripts.oSize; i++) {
                String filename = (String) scripts.oArray[i];
                list.append(filename, null);
            }
            list.setCommandListener(this);
            list.addCommand(runCmd = new Command("Run", Command.OK, 1));
            list.addCommand(srcCmd = new Command("Source", Command.OK, 1));
            list.addCommand(exitCmd = new Command("Exit", Command.EXIT, 1));
            backCmd = new Command("Back", Command.BACK, 1);
        }
        Display.getDisplay(this).setCurrent(list);
        dispStack.add(list);
        */
    }

String[] lines;

    void setup() {

      Vector sketchesInSketchesDirectory = null;

      println( "Fetching the test js files from: " + new File(dataPath("")));
      try{
      sketchesInSketchesDirectory = new FileTraversal().nonRecursivelyListFilesInside( new File(dataPath("")));
      }
      catch (Exception e) {
        println(e);
      }
         println("//////////////////////////////");
        println("Running all the "+ sketchesInSketchesDirectory.size()+" js files:");

    for (int k = 0; k < sketchesInSketchesDirectory.size(); k++) {

      // we figure out the name of the sketch, it's the name of the deepest
      // directory in the path, so we get it with a little string
      // manipulation.
      String[] allDirectoriesInPath = sketchesInSketchesDirectory.get(k).toString().split("\\/");
      String sketchName = allDirectoriesInPath[allDirectoriesInPath.length-1];
      println(sketchName);
    }
         println("//////////////////////////////");


      String c="runCmd";
        if (c == "exitCmd") {
            // notifyDestroyed(); //removed
        } else if (c == "srcCmd") {
          /*  
          int index = list.getSelectedIndex();
            String name = list.getString(index);
            byte[] data = zip.get(name);
            String src = readUTF(data);
            if (srcForm == null) {
                srcForm = new Form("View Source");
                srcForm.addCommand(runCmd);
                srcForm.addCommand(backCmd);
                srcForm.setCommandListener(this);
            }
            srcForm.deleteAll();
            srcForm.append(src);
            dispStack.add(srcForm);
            Display.getDisplay(this).setCurrent(srcForm);
            */
        } else if (c == "runCmd") { // Run

    for (int k = 0; k < sketchesInSketchesDirectory.size(); k++) {

      // we figure out the name of the sketch, it's the name of the deepest
      // directory in the path, so we get it with a little string
      // manipulation.
      String[] allDirectoriesInPath = sketchesInSketchesDirectory.get(k).toString().split("\\/");
      String sketchName = allDirectoriesInPath[allDirectoriesInPath.length-1];


            // int index = list.getSelectedIndex(); //removed
            int index = 1;
            //String name = list.getString(index);
            String name = "miao";
            // byte[] data = zip.get(name);
            // String src = readUTF(data);
            String src = "";

  lines = loadStrings(sketchName);
  for (int i = 0; i < lines.length; i++) {
    src = src + lines[i] + "\n";
  }

            if (ri == null) {
                ri = new RocksInterpreter(src, null, 0, src.length());
                ri.evalString = true;
                ri.DEBUG = false;
            } else {
                ri.reset(src, null, 0, src.length());
            }
            ri.out.setLength(0);
            println(">> Starting executing " + sketchName + " <<\n");
            long start = System.currentTimeMillis();
            Node func = ri.astNode(null, '{', 0, 0);
            ri.astNode(func, '{', 0, ri.endpos);
            Rv rv = new Rv(false, func, 0);
            Rv callObj = rv.co = ri.initGlobalObject();
            ri.call(false, rv, callObj, null, null, 0, 0);
            int time = (int) (System.currentTimeMillis() - start);
            /* //removed
            if (resultForm == null) {
                resultForm = new Form("Result");
                resultForm.addCommand(backCmd);
                resultForm.setCommandListener(this);
            }
            resultForm.deleteAll();
            resultForm.append(ri.out.toString());
            dispStack.add(resultForm);
            Display.getDisplay(this).setCurrent(resultForm);
            */ //removed
            
            println(">> Execution completed in " + time + " ms <<\n");
                }

            } else if (c == "backCmd") {
            dispStack.removeObject(-1);
            // Display.getDisplay(this).setCurrent((Displayable) dispStack.getObject(-1));
        }
    }
    
    static final byte[] readData(InputStream is) throws Exception {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        byte[] bb = new byte[2000];
        int len;
        while ((len = is.read(bb)) > 0) {
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
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return ret;
    }
  
