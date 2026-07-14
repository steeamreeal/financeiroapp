import { getCategories } from "@/lib/data";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { StatementImportTab } from "@/components/import/statement-import-tab";
import { ReceiptImportTab } from "@/components/import/receipt-import-tab";

export default async function ImportarPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Importar lançamentos</h1>
        <p className="text-sm text-muted-foreground">
          Importe extratos bancários ou envie fotos de comprovantes — nada é
          salvo até você conferir e confirmar.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="extrato">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="extrato">Extrato bancário</TabsTrigger>
              <TabsTrigger value="comprovante">
                Comprovante / Nota (foto ou PDF)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="extrato" className="mt-6">
              <StatementImportTab categories={categories} />
            </TabsContent>
            <TabsContent value="comprovante" className="mt-6">
              <ReceiptImportTab categories={categories} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
