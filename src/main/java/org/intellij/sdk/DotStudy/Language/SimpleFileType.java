package org.intellij.sdk.DotStudy.Language;

import com.intellij.openapi.fileTypes.LanguageFileType;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import javax.swing.*;

public class SimpleFileType extends LanguageFileType {

    public static final SimpleFileType INSTANCE = new SimpleFileType();

    private SimpleFileType() {
        super(SimpleLanguage.INSTANCE);
    }

    @NotNull
    @Override
    public String getName() {
        return "Study";
    }

    @NotNull
    @Override
    public String getDescription() {
        return "Study file type";
    }

    @NotNull
    @Override
    public String getDefaultExtension() {
        return "study";
    }

    @Nullable
    @Override
    public Icon getIcon() {
        return SimpleIcons.FILE;
    }

}
