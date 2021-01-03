package org.intellij.sdk.DotStudy.ToolWindow;

import com.intellij.openapi.project.Project;
import com.intellij.openapi.roots.ProjectFileIndex;
import com.intellij.openapi.roots.ProjectRootManager;
import com.intellij.openapi.vfs.VirtualFileManager;
import com.intellij.openapi.vfs.newvfs.BulkFileListener;
import com.intellij.openapi.vfs.newvfs.events.VFileEvent;
import com.intellij.util.messages.MessageBusConnection;
import org.jetbrains.annotations.NotNull;

import java.util.List;

public class FileListener {
    public FileListener(MyToolWindow myToolWindow, Project project) {
        MessageBusConnection connection = project.getMessageBus().connect();

        connection.subscribe(VirtualFileManager.VFS_CHANGES, new BulkFileListener() {
            @Override
            public void after(@NotNull List<? extends VFileEvent> events) {
                for (VFileEvent event : events) {
                    ProjectFileIndex projectFileIndex = ProjectRootManager.getInstance(project).getFileIndex();
                    assert event.getFile() != null;
                    if (projectFileIndex.isInContent(event.getFile())) {
                        //System.out.println("event");

                        myToolWindow.updatePreview(project);
                    }
                }
            }
        });
    }
}
