package org.intellij.sdk.DotStudy.Language;

import com.intellij.openapi.editor.colors.TextAttributesKey;
import com.intellij.openapi.fileTypes.SyntaxHighlighter;
import com.intellij.openapi.options.colors.AttributesDescriptor;
import com.intellij.openapi.options.colors.ColorDescriptor;
import com.intellij.openapi.options.colors.ColorSettingsPage;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import javax.swing.*;
import java.util.Map;

public class SimpleColorSettingsPage implements ColorSettingsPage {

    private static final AttributesDescriptor[] DESCRIPTORS = new AttributesDescriptor[]{
            new AttributesDescriptor("Key", SimpleSyntaxHighlighter.KEY),
            new AttributesDescriptor("Separator", SimpleSyntaxHighlighter.SEPARATOR),
            new AttributesDescriptor("Value", SimpleSyntaxHighlighter.VALUE),

            new AttributesDescriptor("Title", SimpleSyntaxHighlighter.TITLE),
            new AttributesDescriptor("Subtitle", SimpleSyntaxHighlighter.SUBTITLE),
            new AttributesDescriptor("Link", SimpleSyntaxHighlighter.LINK),
            new AttributesDescriptor("Bad value", SimpleSyntaxHighlighter.BAD_CHARACTER)
    };

    @Nullable
    @Override
    public Icon getIcon() {
        return SimpleIcons.FILE;
    }

    @NotNull
    @Override
    public SyntaxHighlighter getHighlighter() {
        return new SimpleSyntaxHighlighter();
    }

    @NotNull
    @Override
    public String getDemoText() {
        return "! DotStudy demo text.\n" +
                "! Title\n" +
                "# Subtitle\n" +
                "& Link\n" +
                "Question? Answer.\n" +
                "Question. Answer.\n" +
                "\n" +
                "! Subtitle\n" +
                "Question? Answer.\n" +
                "Question. Answer.\n";
    }

    @Nullable
    @Override
    public Map<String, TextAttributesKey> getAdditionalHighlightingTagToDescriptorMap() {
        return null;
    }

    @NotNull
    @Override
    public AttributesDescriptor @NotNull [] getAttributeDescriptors() {
        return DESCRIPTORS;
    }

    @NotNull
    @Override
    public ColorDescriptor @NotNull [] getColorDescriptors() {
        return ColorDescriptor.EMPTY_ARRAY;
    }

    @NotNull
    @Override
    public String getDisplayName() {
        return "Study";
    }

}

