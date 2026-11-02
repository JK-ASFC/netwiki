// NetWiki — tâche de fond (WorkManager) : vérifie les nouveautés et prévient l'utilisateur par une notification.
// Copyright (c) 2026 JK-ASFC — licence MIT.
package io.netwiki.app;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

public class UpdateWorker extends Worker {

    public UpdateWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);
    }

    @NonNull
    @Override
    public Result doWork() {
        try {
            UpdateCheck.runBackgroundCheck(getApplicationContext());
            return Result.success();
        } catch (Exception e) {
            return getRunAttemptCount() < 3 ? Result.retry() : Result.failure();
        }
    }
}
