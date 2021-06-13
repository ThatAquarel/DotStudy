// This is a generated file. Not intended for manual editing.
package org.intellij.sdk.DotStudy.Language.parser;

import com.intellij.lang.PsiBuilder;
import com.intellij.lang.PsiBuilder.Marker;
import static org.intellij.sdk.DotStudy.Language.psi.SimpleTypes.*;
import static com.intellij.lang.parser.GeneratedParserUtilBase.*;
import com.intellij.psi.tree.IElementType;
import com.intellij.lang.ASTNode;
import com.intellij.psi.tree.TokenSet;
import com.intellij.lang.PsiParser;
import com.intellij.lang.LightPsiParser;

@SuppressWarnings({"SimplifiableIfStatement", "UnusedAssignment"})
public class SimpleParser implements PsiParser, LightPsiParser {

  public ASTNode parse(IElementType t, PsiBuilder b) {
    parseLight(t, b);
    return b.getTreeBuilt();
  }

  public void parseLight(IElementType t, PsiBuilder b) {
    boolean r;
    b = adapt_builder_(t, b, this, null);
    Marker m = enter_section_(b, 0, _COLLAPSE_, null);
    r = parse_root_(t, b);
    exit_section_(b, 0, m, t, r, true, TRUE_CONDITION);
  }

  protected boolean parse_root_(IElementType t, PsiBuilder b) {
    return parse_root_(t, b, 0);
  }

  static boolean parse_root_(IElementType t, PsiBuilder b, int l) {
    return simpleFile(b, l + 1);
  }

  /* ********************************************************** */
  // property|TITLE|SUBTITLE|LINK|CRLF
  static boolean item_(PsiBuilder b, int l) {
    if (!recursion_guard_(b, l, "item_")) return false;
    boolean r;
    r = property(b, l + 1);
    if (!r) r = consumeToken(b, TITLE);
    if (!r) r = consumeToken(b, SUBTITLE);
    if (!r) r = consumeToken(b, LINK);
    if (!r) r = consumeToken(b, CRLF);
    return r;
  }

  /* ********************************************************** */
  // KEY SEPARATOR (VALUE VALUE_SEPARATOR)*
  public static boolean property(PsiBuilder b, int l) {
    if (!recursion_guard_(b, l, "property")) return false;
    if (!nextTokenIs(b, KEY)) return false;
    boolean r;
    Marker m = enter_section_(b);
    r = consumeTokens(b, 0, KEY, SEPARATOR);
    r = r && property_2(b, l + 1);
    exit_section_(b, m, PROPERTY, r);
    return r;
  }

  // (VALUE VALUE_SEPARATOR)*
  private static boolean property_2(PsiBuilder b, int l) {
    if (!recursion_guard_(b, l, "property_2")) return false;
    while (true) {
      int c = current_position_(b);
      if (!property_2_0(b, l + 1)) break;
      if (!empty_element_parsed_guard_(b, "property_2", c)) break;
    }
    return true;
  }

  // VALUE VALUE_SEPARATOR
  private static boolean property_2_0(PsiBuilder b, int l) {
    if (!recursion_guard_(b, l, "property_2_0")) return false;
    boolean r;
    Marker m = enter_section_(b);
    r = consumeTokens(b, 0, VALUE, VALUE_SEPARATOR);
    exit_section_(b, m, null, r);
    return r;
  }

  /* ********************************************************** */
  // item_*
  static boolean simpleFile(PsiBuilder b, int l) {
    if (!recursion_guard_(b, l, "simpleFile")) return false;
    while (true) {
      int c = current_position_(b);
      if (!item_(b, l + 1)) break;
      if (!empty_element_parsed_guard_(b, "simpleFile", c)) break;
    }
    return true;
  }

}
