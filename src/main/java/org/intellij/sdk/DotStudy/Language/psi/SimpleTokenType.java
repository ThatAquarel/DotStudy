package org.intellij.sdk.DotStudy.Language.psi;

import com.intellij.psi.tree.IElementType;
import org.intellij.sdk.DotStudy.Language.SimpleLanguage;
import org.jetbrains.annotations.NonNls;
import org.jetbrains.annotations.NotNull;

public class SimpleTokenType extends IElementType {

    public SimpleTokenType(@NotNull @NonNls String debugName) {
        super(debugName, SimpleLanguage.INSTANCE);
    }

    @Override
    public String toString() {
        return "SimpleTokenType." + super.toString();
    }

}

