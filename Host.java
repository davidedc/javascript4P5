/*
javascript4P5 is a port of javascript4me for Processing, by Davide Della Casa
javascript4me is made by Wang Lei ( rockswang@gmail.com ) and is released under GNU Lesser GPL
You can find javascript4me at http://code.google.com/p/javascript4me/
*/

public interface Host {
    
    /**
     * "http://www.domain.com/a.png": download from web
     * "a.png": load a local image
     * "style.css": load a local css style
     * "rgbImage@20,20,aarrggbb": create a semi-transparent image
     * @param name
     * @return css: String, image: Image object
     */
    public Object getResource(String name);
    
    /**
     * returned value is used by "onsubmit" event
     * @param src
     * @param eventId
     * @return 
     */
    public boolean handleEvent(Node src, int eventId);

}
