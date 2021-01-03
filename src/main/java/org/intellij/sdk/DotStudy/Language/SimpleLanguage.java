package org.intellij.sdk.DotStudy.Language;

import com.intellij.lang.Language;

public class SimpleLanguage extends Language {

    public static final SimpleLanguage INSTANCE = new SimpleLanguage();

    private SimpleLanguage() {
        super("Study");
    }

}
