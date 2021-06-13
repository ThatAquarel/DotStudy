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

CRLF=\R
SPACE=[\ ]
WHITE_SPACE=[\ \n\t\f]

TITLE=("!")[^\r\n]*
SUBTITLE=("#")[^\r\n]*
LINK=("&")[^\r\n]*

FIRST_KEY_CARACTER=[^-.?#!& \n\t\f\\]
KEY_CHARACTER={CRLF}?{FIRST_KEY_CARACTER}
SEPARATOR=[.?]

FIRST_VALUE_CHARACTER=[^-.?#!& \n\t\f\\]
VALUE_CHARACTER={CRLF}?[^-.?#!&\n\t\f\\]
VALUE_SEPARATOR="."

LIST_SEPARATOR="-"
DEC_INTEGER= 0 | [1-9][0-9]*
INT_LIST_SEPARATOR={DEC_INTEGER}(" "{DEC_INTEGER})*

%state WAITING_VALUE

%%

<YYINITIAL> {TITLE}                                         { yybegin(YYINITIAL); return SimpleTypes.TITLE; }
<YYINITIAL> {SUBTITLE}                                      { yybegin(YYINITIAL); return SimpleTypes.SUBTITLE; }
<YYINITIAL> {LINK}                                          { yybegin(YYINITIAL); return SimpleTypes.LINK; }

<YYINITIAL> {LIST_SEPARATOR}                                { yybegin(WAITING_VALUE) ; return SimpleTypes.LIST_SEPARATOR;}
<YYINITIAL> {INT_LIST_SEPARATOR}{LIST_SEPARATOR}            { yybegin(WAITING_VALUE) ; return SimpleTypes.LIST_SEPARATOR;}

<YYINITIAL> {FIRST_KEY_CARACTER}{KEY_CHARACTER}+            { yybegin(YYINITIAL); return SimpleTypes.KEY; }
<YYINITIAL> {SEPARATOR}                                     { yybegin(WAITING_VALUE); return SimpleTypes.SEPARATOR; }

<WAITING_VALUE> {
    {FIRST_VALUE_CHARACTER}{VALUE_CHARACTER}+               { yybegin(WAITING_VALUE); return SimpleTypes.VALUE; }
    {VALUE_SEPARATOR}                                       { yybegin(WAITING_VALUE); return SimpleTypes.VALUE_SEPARATOR; }

    {SPACE}+                                                { yybegin(WAITING_VALUE); return TokenType.WHITE_SPACE; }
    {CRLF}({CRLF}|{WHITE_SPACE})+                           { yybegin(YYINITIAL); return TokenType.WHITE_SPACE; }
    {WHITE_SPACE}+                                          { yybegin(YYINITIAL); return TokenType.WHITE_SPACE; }
}

({CRLF}|{WHITE_SPACE})+                                     { yybegin(YYINITIAL); return TokenType.WHITE_SPACE; }

[^]                                                         { return TokenType.BAD_CHARACTER; }
