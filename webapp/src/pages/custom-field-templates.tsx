import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ICustomFieldTemplate } from "@/entities/types/customFieldTemplateTypes";
import CustomFieldTemplateList from "@/components/customFieldTemplate/CustomFieldTemplateList";
import CustomFieldTemplateDetails from "@/components/customFieldTemplate/CustomFieldTemplateDetails";
import CustomFieldTemplateForm from "@/components/customFieldTemplate/CustomFieldTemplateForm";
import Layout from "@/components/appbar/Layout";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function CustomFieldTemplates() {
  const [fields, setFields] = useState<ICustomFieldTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<ICustomFieldTemplate | undefined>(
    undefined
  );

  useEffect(() => {
    if (typeof window === "undefined") return; // Skip if SSR
    const data = localStorage.getItem("customFields");
    const stored = data ? JSON.parse(data) : [];
    setFields(stored);
    if (stored.length > 0 && !selectedId) {
      setSelectedId(stored[0].id);
    }
  }, []);

  const handleSave = (field: ICustomFieldTemplate) => {
    let updated;
    const existingIndex = fields.findIndex((f) => f.id === field.id);
    if (existingIndex !== -1) {
      updated = [...fields];
      updated[existingIndex] = field;
    } else {
      updated = [...fields, field];
    }
    setFields(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("customFields", JSON.stringify(updated));
    }
    setSelectedId(String(field.id));
  };

  const handleDelete = () => {
    if (!selectedId) return;
    const updated = fields.filter((f) => f.id !== selectedId);
    setFields(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("customFields", JSON.stringify(updated));
    }

    const newSelected = updated.length ? String(updated[0].id) : null;
    setSelectedId(newSelected);
  };

  const selectedField = fields.find((f) => f.id === selectedId);

  return (
    <Layout>
      <Box display="flex" sx={{ mt: "64px" }}>
        <CustomFieldTemplateList
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddClick={() => {
            setEditData(undefined);
            setFormOpen(true);
          }}
          data={fields.map((f) => ({ ...f, id: f.id ?? null }))}
        />
        <Box flex={1}>
          <CustomFieldTemplateDetails
            field={selectedField}
            onEdit={() => {
              setEditData(selectedField);
              setFormOpen(true);
            }}
            onDelete={handleDelete}
          />
        </Box>
        <CustomFieldTemplateForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          initialData={editData}
        />
      </Box>
    </Layout>
  );
}

export const getServerSideProps = withPageAuthRequired();
