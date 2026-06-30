"use client";

import { FileText, ImagePlus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ResourceWizardFormData } from "@/features/resources/types/wizard";

type ResourceFilesStepProps = {
  data: ResourceWizardFormData;
  onChange: (patch: Partial<ResourceWizardFormData>) => void;
};

export function ResourceFilesStep({ data, onChange }: ResourceFilesStepProps) {
  const handleDocumentAdd = () => {
    const name = `Documento ${data.documentNames.length + 1}`;
    onChange({ documentNames: [...data.documentNames, name] });
  };

  const handlePhotoAdd = () => {
    onChange({ photoCount: data.photoCount + 1 });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">Archivos y documentación</h2>
        <p className="text-sm text-muted-foreground">
          Adjunta fichas técnicas, manuales o fotografías del recurso. En esta
          versión los archivos no se almacenan.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Documentos</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Fichas de seguridad, manuales, fichas técnicas.
          </p>
          <div className="flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/10 p-4">
            <Upload className="size-5 text-muted-foreground" />
            <Button variant="outline" size="sm" onClick={handleDocumentAdd}>
              Seleccionar documento
            </Button>
          </div>
          {data.documentNames.length > 0 ? (
            <ul className="space-y-1 text-sm text-muted-foreground">
              {data.documentNames.map((name) => (
                <li key={name}>· {name}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <ImagePlus className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Fotografías</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Imagen principal y galería del recurso.
          </p>
          <div className="flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/10 p-4">
            <ImagePlus className="size-5 text-muted-foreground" />
            <Button variant="outline" size="sm" onClick={handlePhotoAdd}>
              Seleccionar fotografía
            </Button>
          </div>
          {data.photoCount > 0 ? (
            <p className="text-sm text-muted-foreground">
              {data.photoCount} archivo(s) seleccionado(s)
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
