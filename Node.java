/*
javascript4P5 is a port of javascript4me for Processing, by Davide Della Casa
javascript4me is made by Wang Lei ( rockswang@gmail.com ) and is released under GNU Lesser GPL
You can find javascript4me at http://code.google.com/p/javascript4me/
*/

import java.util.Hashtable;

public class Node {
    
    public Object owner;
    
    public Node parent;
    
    public Pack children;
    
    /**
     * properties = Pack(n, n) {
     *   { prop-name0, prop-name1... },
     *   { prop-valu0, prop-valu1... },
     * }
     * As script AST node: tokens
     */
    public Pack properties; 
    
    // As script AST node: function name
    public String id;
    
    /** 
     * As script AST node: 
     *  - switch: branches
     *  - function: className.oArray[0]: callObj
     */ 
    public Pack className;
    
    public int tagType; // enumeration type
    
    // As script AST node: startpos
    public int display; // inline | block | inline-block | none, visible | hidden
    
    static final int DI_NORMAL = 1;

    // As script AST node: len, if (len >= 0) then the node is raw
    public int state = DI_NORMAL; // normal, hover (focus), active

    public Node(Object owner, int tagType) {
        this.owner = owner;
        this.tagType = tagType;
    }
    

    
    public Node appendChild(Node child) {
        if (children == null) {
            children = new Pack(-1, 2);
        }
        child.parent = this;
        children.add(child);
        return this;
    }
    
    public Node getChild(int index) {
        if (children != null && index < children.oSize) {
            return (Node) children.oArray[index];
        }
        return null;
    }
    
    /**
     * for debug only
     */
    public final String toString() {
        StringBuffer buf = new StringBuffer();
        Pack prop = this.properties, cc = this.children;
         // RocksInterpreter
            Object[] tinfo = (Object[]) prop.oArray[display];
            Pack l = ((RocksInterpreter) owner).loc(((int[]) tinfo[0])[0]);
            int cclen = cc != null ? cc.oSize : 0;
            buf.append("astNode(").append(RC.tokenName(tagType, null))
                    .append(')').append(cclen > 0 ? "[" + cclen + "]" : "")
                    .append(" at (").append(l.iSize).append(',').append(l.oSize).append(')');
            if (tagType == RC.TOK_FUNCTION) {
                buf.append(" <ID=").append(id).append('>');
            } else if (tagType == RC.TOK_MUL && cc != null) {
                buf.append(" <RPN> { ").append(RC.tokensText(cc, 0, cc.iSize)).append(" }");
            }

            int pos = display, len = state & 0x7FFFFFFF;
            buf.append(" <RAW=").append(pos).append(",").append(len).append("> { ");
            if (len <= 10) {
                buf.append(RC.tokensText(prop, pos, len));
            } else {
                buf.append(RC.tokensText(prop, pos, 5)).append(" ... ")
                        .append(RC.tokensText(prop, pos + len - 5, 5));
            }
            buf.append(" }");
            
            int scanningChildren = 0;
            while (  getChild(scanningChildren) != null) {
              buf.append("\n"+getChild(scanningChildren).toString());
              scanningChildren++;
            }

        return buf.toString();
    }
        
}
