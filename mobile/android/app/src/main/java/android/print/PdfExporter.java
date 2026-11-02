// NetWiki — enregistrement direct d'une page en PDF (texte sélectionnable), sans passer par la boîte d'impression.
// Placé dans le paquet android.print pour accéder aux constructeurs des fonctions de rappel du moteur d'impression.
// Copyright (c) 2026 JK-ASFC — licence MIT.
package android.print;

import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import java.io.File;

public final class PdfExporter {

    public interface Callback {
        void onDone(File file);

        void onError(String message);
    }

    private PdfExporter() {}

    public static void export(final PrintDocumentAdapter adapter, final PrintAttributes attributes, final File out, final Callback cb) {
        adapter.onStart();
        adapter.onLayout(
            null,
            attributes,
            new CancellationSignal(),
            new PrintDocumentAdapter.LayoutResultCallback() {
                @Override
                public void onLayoutFinished(PrintDocumentInfo info, boolean changed) {
                    final ParcelFileDescriptor pfd;
                    try {
                        pfd = ParcelFileDescriptor.open(
                            out,
                            ParcelFileDescriptor.MODE_CREATE | ParcelFileDescriptor.MODE_TRUNCATE | ParcelFileDescriptor.MODE_READ_WRITE
                        );
                    } catch (Exception e) {
                        adapter.onFinish();
                        cb.onError("Création du fichier PDF impossible : " + e.getMessage());
                        return;
                    }
                    adapter.onWrite(
                        new PageRange[] { PageRange.ALL_PAGES },
                        pfd,
                        new CancellationSignal(),
                        new PrintDocumentAdapter.WriteResultCallback() {
                            @Override
                            public void onWriteFinished(PageRange[] pages) {
                                close(pfd);
                                adapter.onFinish();
                                cb.onDone(out);
                            }

                            @Override
                            public void onWriteFailed(CharSequence error) {
                                close(pfd);
                                adapter.onFinish();
                                cb.onError("Génération du PDF impossible" + (error != null ? " : " + error : "."));
                            }

                            @Override
                            public void onWriteCancelled() {
                                close(pfd);
                                adapter.onFinish();
                                cb.onError("Génération du PDF annulée.");
                            }
                        }
                    );
                }

                @Override
                public void onLayoutFailed(CharSequence error) {
                    adapter.onFinish();
                    cb.onError("Mise en page du PDF impossible" + (error != null ? " : " + error : "."));
                }

                @Override
                public void onLayoutCancelled() {
                    adapter.onFinish();
                    cb.onError("Génération du PDF annulée.");
                }
            },
            null
        );
    }

    private static void close(ParcelFileDescriptor pfd) {
        try {
            pfd.close();
        } catch (Exception ignored) {}
    }
}
