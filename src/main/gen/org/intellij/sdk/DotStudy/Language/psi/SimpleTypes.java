// This is a generated file. Not intended for manual editing.
package org.intellij.sdk.DotStudy.Language.psi;

import com.intellij.psi.tree.IElementType;
import com.intellij.psi.PsiElement;
import com.intellij.lang.ASTNode;
import org.intellij.sdk.DotStudy.Language.psi.impl.*;

public interface SimpleTypes {

  IElementType PROPERTY = new SimpleElementType("PROPERTY");

  IElementType CRLF = new SimpleTokenType("CRLF");
  IElementType KEY = new SimpleTokenType("KEY");
  IElementType LINK = new SimpleTokenType("LINK");
  IElementType SEPARATOR = new SimpleTokenType("SEPARATOR");
  IElementType SUBTITLE = new SimpleTokenType("SUBTITLE");
  IElementType TITLE = new SimpleTokenType("TITLE");
  IElementType VALUE = new SimpleTokenType("VALUE");
  IElementType VALUE_SEPARATOR = new SimpleTokenType("VALUE_SEPARATOR");

  class Factory {
    public static PsiElement createElement(ASTNode node) {
      IElementType type = node.getElementType();
      if (type == PROPERTY) {
        return new SimplePropertyImpl(node);
      }
      throw new AssertionError("Unknown element type: " + type);
    }
  }
}
