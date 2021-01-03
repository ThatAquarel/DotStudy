package org.intellij.sdk.DotStudy.Util;

import com.intellij.openapi.editor.Editor;
import com.intellij.openapi.fileEditor.FileDocumentManager;
import com.intellij.openapi.fileEditor.FileEditorManager;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.vfs.VirtualFile;
import com.intellij.psi.*;
import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;

public class FormatUtil {
    public static ArrayList<String> getMessages(Project project) {
        Editor editor = FileEditorManager.getInstance(project).getSelectedTextEditor();
        assert editor != null;
        VirtualFile virtualFile = FileDocumentManager.getInstance().getFile(editor.getDocument());
        assert virtualFile != null;
        PsiFile psiFile = PsiManager.getInstance(project).findFile(virtualFile);
        assert psiFile != null;

        ArrayList<String> message = new ArrayList<>();

        psiFile.accept(new PsiRecursiveElementWalkingVisitor() {
            //get questions/answers
            @Override
            public void visitElement(@NotNull PsiElement element) {
                super.visitElement(element);
                if (element.getFirstChild() != null && element.getLastChild() != null &&
                        !element.getText().startsWith("#") && !element.getText().startsWith("!")) {
                    String question = element.getFirstChild().getText() + element.getFirstChild().getNextSibling().getText();
                    String answer = element.getLastChild().getText();
                    message.add(question + " ||" + answer + "||");

                    //System.out.println(element.getFirstChild().getNextSibling().getText());
                    //System.out.println(element.getFirstChild().getText() + element.getFirstChild().getNextSibling().getText() + " "
                    //+ element.getLastChild().getText());
                }
            }

            //get titles
            @Override
            public void visitComment(@NotNull PsiComment comment) {
                super.visitComment(comment);
                String title = comment.getText();
                if (title.startsWith("#")) {
                    message.add("__**" + title.replaceFirst("#", "") + "**__");
                } else if (title.startsWith("!")) {
                    message.add("** **\n**" + title.replaceFirst("!", "") + "**");
                }
                //System.out.println(comment.getText());
            }
        });

        return message;
    }
}
