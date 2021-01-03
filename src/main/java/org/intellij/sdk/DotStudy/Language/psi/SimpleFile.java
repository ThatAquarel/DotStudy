package org.intellij.sdk.DotStudy.Language.psi;

import com.intellij.extapi.psi.PsiFileBase;
import com.intellij.openapi.fileTypes.FileType;
import com.intellij.psi.FileViewProvider;
import org.intellij.sdk.DotStudy.Language.SimpleFileType;
import org.intellij.sdk.DotStudy.Language.SimpleLanguage;
import org.jetbrains.annotations.NotNull;

public class SimpleFile extends PsiFileBase {

    public SimpleFile(@NotNull FileViewProvider viewProvider) {
        super(viewProvider, SimpleLanguage.INSTANCE);
    }

    @NotNull
    @Override
    public FileType getFileType() {
        return SimpleFileType.INSTANCE;
    }

    @Override
    public String toString() {
        return "Simple File";
    }

}