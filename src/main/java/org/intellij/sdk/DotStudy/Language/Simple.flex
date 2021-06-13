package org.intellij.sdk.DotStudy.Language;

import com.intellij.lexer.FlexLexer;
import com.intellij.psi.tree.IElementType;
import org.intellij.sdk.DotStudy.Language.psi.SimpleTypes;
import com.intellij.psi.TokenType;

%%

%class SimpleLexer
%implements FlexLexer
%unicode
%function advance
%type IElementType
%eof{  return;
%eof}

//CRLF=\R
//WHITE_SPACE=[\ \n\t\f]
//FIRST_VALUE_CHARACTER=[^ \n\f\\] | "\\"{CRLF} | "\\".
//VALUE_CHARACTER=[^\n\f\\] | "\\"{CRLF} | "\\".
//END_OF_LINE_COMMENT=("#"|"!")[^\r\n]*
//SEPARATOR=[.?]
//KEY_CHARACTER=[^.?\ \n\t\f\\] | " "
//SEPARATOR=[.?]
//KEY_CHARACTER=[^.?\ \n\t\f\\] | "\\ "

CRLF=\R
WHITE_SPACE=[\ \n\t\f]

TITLE=("!")[^\r\n]*
SUBTITLE=("#")[^\r\n]*
LINK=("&")[^\r\n]*

FIRST_KEY_CARACTER=[^.?#!& \n\t\f\\]
KEY_CHARACTER={CRLF}?{FIRST_KEY_CARACTER}
SEPARATOR=[.?]

FIRST_VALUE_CHARACTER=[^.?#!& \n\t\f\\]
VALUE_CHARACTER={CRLF}?[^.?#!&\n\t\f\\]
VALUE_SEPARATOR="."

%state WAITING_VALUE

%%

<YYINITIAL> {TITLE}                                         { yybegin(YYINITIAL); return SimpleTypes.TITLE; }
<YYINITIAL> {SUBTITLE}                                      { yybegin(YYINITIAL); return SimpleTypes.SUBTITLE; }
<YYINITIAL> {LINK}                                          { yybegin(YYINITIAL); return SimpleTypes.LINK; }

<YYINITIAL> {FIRST_KEY_CARACTER}{KEY_CHARACTER}+            { yybegin(YYINITIAL); return SimpleTypes.KEY; }
<YYINITIAL> {SEPARATOR}                                     { yybegin(WAITING_VALUE); return SimpleTypes.SEPARATOR; }

<WAITING_VALUE> {FIRST_VALUE_CHARACTER}{VALUE_CHARACTER}*   { yybegin(WAITING_VALUE); return SimpleTypes.VALUE; }
<WAITING_VALUE> {VALUE_SEPARATOR}                           { yybegin(WAITING_VALUE); return SimpleTypes.VALUE_SEPARATOR; }

<WAITING_VALUE> {CRLF}({CRLF}|{WHITE_SPACE})+               { yybegin(YYINITIAL); return TokenType.WHITE_SPACE; }
<WAITING_VALUE> {WHITE_SPACE}+                              { yybegin(WAITING_VALUE); return TokenType.WHITE_SPACE; }

//<WAITING_VALUE> ({CRLF}|{WHITE_SPACE})+               { yybegin(WAITING_VALUE); return TokenType.WHITE_SPACE; }
//<WAITING_VALUE> {WHITE_SPACE}+                              { yybegin(WAITING_VALUE); return TokenType.WHITE_SPACE; }

//<WAITING_VALUE> {FIRST_VALUE_CHARACTER}{VALUE_CHARACTER}*   { yybegin(YYINITIAL); return SimpleTypes.VALUE; }
//<WAITING_VALUE> {FIRST_VALUE_CHARACTER}{VALUE_CHARACTER}+   { yybegin(YYINITIAL); return SimpleTypes.VALUE; }
//<WAITING_VALUE> {VALUE_SEPARATOR}                           { yybegin(WAITING_VALUE); return SimpleTypes.VALUE_SEPARATOR; }

({CRLF}|{WHITE_SPACE})+                                     { yybegin(YYINITIAL); return TokenType.WHITE_SPACE; }

[^]                                                         { return TokenType.BAD_CHARACTER; }
