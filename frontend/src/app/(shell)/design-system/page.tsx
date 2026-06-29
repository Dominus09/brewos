import { Inbox } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { LoadingState } from "@/components/design-system/loading-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <>
      <AppHeader
        title="Design System"
        description="Componentes base de BrewOS"
      />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-12 pb-12">
          <Section
            title="Botones"
            description="Variantes para acciones primarias, secundarias y destructivas."
          >
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </Section>

          <Separator />

          <Section title="Inputs" description="Campos de formulario estándar.">
            <Card className="max-w-md">
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="ds-input">Etiqueta</Label>
                  <Input id="ds-input" placeholder="Placeholder" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ds-disabled">Deshabilitado</Label>
                  <Input id="ds-disabled" disabled placeholder="No editable" />
                </div>
              </CardContent>
            </Card>
          </Section>

          <Separator />

          <Section title="Select" description="Selección en listas desplegables.">
            <Card className="max-w-md">
              <CardContent className="pt-6">
                <Select defaultValue="opcion-1">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="opcion-1">Opción 1</SelectItem>
                    <SelectItem value="opcion-2">Opción 2</SelectItem>
                    <SelectItem value="opcion-3">Opción 3</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </Section>

          <Separator />

          <Section title="Cards" description="Contenedores para módulos y contenido.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Título de card</CardTitle>
                  <CardDescription>Descripción secundaria</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Contenido de ejemplo para layout.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-accent/30">
                <CardHeader>
                  <CardTitle>Card activa</CardTitle>
                  <CardDescription>Estado destacado</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Variante con acento primario suave.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Separator />

          <Section title="Badges" description="Estados semánticos del sistema.">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge className="border-transparent bg-success-muted text-success">
                Success
              </Badge>
              <Badge className="border-transparent bg-warning-muted text-warning">
                Warning
              </Badge>
              <Badge variant="destructive">Danger</Badge>
              <Badge className="border-transparent bg-info-muted text-info">
                Info
              </Badge>
            </div>
          </Section>

          <Separator />

          <Section
            title="Sidebar y Navbar"
            description="Navegación lateral colapsable y header superior activos en esta vista."
          >
            <p className="text-sm text-muted-foreground">
              La barra lateral izquierda y el encabezado superior son los
              componentes de navegación del shell. En móvil, la sidebar se
              abre como drawer mediante el botón del header.
            </p>
          </Section>

          <Separator />

          <Section title="Tablas" description="Listados de datos con tipografía mono.">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recurso</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>—</TableCell>
                    <TableCell className="font-[family-name:var(--font-jetbrains)] text-sm">
                      —
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">—</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>—</TableCell>
                    <TableCell className="font-[family-name:var(--font-jetbrains)] text-sm">
                      —
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">—</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </Section>

          <Separator />

          <Section title="Estados" description="Hover, focus, disabled y selected.">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline">Hover me</Button>
              <Button disabled>Disabled</Button>
              <div className="rounded-lg border border-primary bg-accent px-4 py-2 text-sm text-accent-foreground">
                Selected
              </div>
            </div>
          </Section>

          <Separator />

          <Section title="Loading" description="Indicadores de carga.">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <LoadingState variant="spinner" />
              </Card>
              <Card>
                <LoadingState variant="skeleton" />
              </Card>
            </div>
          </Section>

          <Separator />

          <Section title="Empty State" description="Cuando no hay contenido.">
            <Card>
              <EmptyState
                icon={Inbox}
                title="Sin registros"
                description="Aún no hay elementos en esta sección."
                actionLabel="Acción de ejemplo"
              />
            </Card>
          </Section>
        </div>
      </main>
    </>
  );
}
