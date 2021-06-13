package org.intellij.sdk.DotStudy.Language;


import com.intellij.lexer.Lexer;
import com.intellij.openapi.editor.DefaultLanguageHighlighterColors;
import com.intellij.openapi.editor.HighlighterColors;
import com.intellij.openapi.editor.colors.CodeInsightColors;
import com.intellij.openapi.editor.colors.EditorColors;
import com.intellij.openapi.editor.colors.TextAttributesKey;
import com.intellij.openapi.fileTypes.SyntaxHighlighterBase;
import com.intellij.psi.TokenType;
import com.intellij.psi.tree.IElementType;
import org.intellij.sdk.DotStudy.Language.psi.SimpleTypes;
import org.jetbrains.annotations.NotNull;

import static com.intellij.openapi.editor.colors.TextAttributesKey.createTextAttributesKey;

public class SimpleSyntaxHighlighter extends SyntaxHighlighterBase {

    public static final TextAttributesKey SEPARATOR =
            createTextAttributesKey("SIMPLE_SEPARATOR", DefaultLanguageHighlighterColors.OPERATION_SIGN);
    public static final TextAttributesKey KEY =
            createTextAttributesKey("SIMPLE_KEY", DefaultLanguageHighlighterColors.KEYWORD);
    public static final TextAttributesKey VALUE =
            createTextAttributesKey("SIMPLE_VALUE", DefaultLanguageHighlighterColors.STRING);

    public static final TextAttributesKey TITLE =
            createTextAttributesKey("SIMPLE_TITLE", DefaultLanguageHighlighterColors.INSTANCE_METHOD);
    public static final TextAttributesKey SUBTITLE =
            createTextAttributesKey("SIMPLE_SUBTITLE", DefaultLanguageHighlighterColors.INSTANCE_METHOD);
    public static final TextAttributesKey LINK =
            createTextAttributesKey("SIMPLE_LINK", CodeInsightColors.FOLLOWED_HYPERLINK_ATTRIBUTES);
    public static final TextAttributesKey BAD_CHARACTER =
            createTextAttributesKey("SIMPLE_BAD_CHARACTER", HighlighterColors.BAD_CHARACTER);


    private static final TextAttributesKey[] BAD_CHAR_KEYS = new TextAttributesKey[]{BAD_CHARACTER};
    private static final TextAttributesKey[] SEPARATOR_KEYS = new TextAttributesKey[]{SEPARATOR};
    private static final TextAttributesKey[] KEY_KEYS = new TextAttributesKey[]{KEY};
    private static final TextAttributesKey[] VALUE_KEYS = new TextAttributesKey[]{VALUE};

    private static final TextAttributesKey[] TITLE_KEYS = new TextAttributesKey[]{TITLE};
    private static final TextAttributesKey[] SUBTITLE_KEYS = new TextAttributesKey[]{SUBTITLE};
    private static final TextAttributesKey[] LINK_KEYS = new TextAttributesKey[]{LINK};

    private static final TextAttributesKey[] EMPTY_KEYS = new TextAttributesKey[0];

    @NotNull
    @Override
    public Lexer getHighlightingLexer() {
        return new SimpleLexerAdapter();
    }

    @NotNull
    @Override
    public TextAttributesKey @NotNull [] getTokenHighlights(IElementType tokenType) {
        if (tokenType.equals(SimpleTypes.SEPARATOR)) {
            return SEPARATOR_KEYS;
        } else if (tokenType.equals(SimpleTypes.KEY)) {
            return KEY_KEYS;
        } else if (tokenType.equals(SimpleTypes.VALUE)) {
            return VALUE_KEYS;
        } else if (tokenType.equals(SimpleTypes.TITLE)) {
            return TITLE_KEYS;
        } else if (tokenType.equals(SimpleTypes.SUBTITLE)) {
            return SUBTITLE_KEYS;
        } else if (tokenType.equals(SimpleTypes.LINK)) {
            return LINK_KEYS;
        } else if (tokenType.equals(TokenType.BAD_CHARACTER)) {
            return BAD_CHAR_KEYS;
        } else {
            return EMPTY_KEYS;
        }
    }

}