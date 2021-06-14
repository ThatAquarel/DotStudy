package org.intellij.sdk.DotStudy.Language;

import com.intellij.formatting.*;
import com.intellij.lang.ASTNode;
import com.intellij.openapi.util.TextRange;
import com.intellij.psi.PsiFile;
import com.intellij.psi.codeStyle.CodeStyleSettings;
import org.intellij.sdk.DotStudy.Language.psi.SimpleTypes;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class SimpleFormattingModelBuilder implements FormattingModelBuilder {

    private static SpacingBuilder createSpaceBuilder(CodeStyleSettings settings) {
        return new SpacingBuilder(settings, SimpleLanguage.INSTANCE)
                .between(SimpleTypes.KEY, SimpleTypes.SEPARATOR).spaceIf(false)
                .after(SimpleTypes.SEPARATOR).spaceIf(true)
                .between(SimpleTypes.ANSWER, SimpleTypes.ANSWER).spaceIf(true)
                .between(SimpleTypes.LIST_SEPARATOR, SimpleTypes.VALUE).spaceIf(true)
                .between(SimpleTypes.VALUE, SimpleTypes.VALUE_SEPARATOR).spaceIf(false)
                .after(SimpleTypes.VALUE_SEPARATOR).spaceIf(true);
    }

    @Override
    public @NotNull FormattingModel createModel(@NotNull FormattingContext formattingContext) {
        CodeStyleSettings settings = formattingContext.getCodeStyleSettings();

        return FormattingModelProvider.createFormattingModelForPsiFile(
                formattingContext.getContainingFile(),
                new SimpleBlock(formattingContext.getNode(),
                        Wrap.createWrap(WrapType.NONE, false),
                        Alignment.createAlignment(),
                        createSpaceBuilder(settings)),
                settings);
    }

    @Nullable
    @Override
    public TextRange getRangeAffectingIndent(PsiFile file, int offset, ASTNode elementAtOffset) {
        return null;
    }
}