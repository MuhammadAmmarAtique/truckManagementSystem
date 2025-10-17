import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ICustomFieldGroup } from "@/entities/types/customFieldGroupTypes";
import CustomFieldTemplateList from "@/components/customFieldTemplate/CustomFieldTemplateList";
import CustomFieldGroupDetails from "@/components/customFieldGroup/customFieldGroupDetails";
import CustomFieldGroupForm from "@/components/customFieldGroup/CustomFieldGroupForm";
import Layout from "@/components/appbar/Layout";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function CustomFieldGroups() {
  const [groups, setGroups] = useState<ICustomFieldGroup[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<ICustomFieldGroup | undefined>(
    undefined
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem("customFieldGroups");
    console.log("Loaded custom field groups from localStorage:", data);

    const stored = data ? JSON.parse(data) : [];
    setGroups(stored);
    if (stored.length > 0 && !selectedId) {
      setSelectedId(stored[0].id);
    }
  }, []);

  const handleSave = (group: ICustomFieldGroup) => {
    let updated;
    const existingIndex = groups.findIndex((g) => g.id === group.id);
    if (existingIndex !== -1) {
      updated = [...groups];
      updated[existingIndex] = group;
    } else {
      updated = [...groups, group];
    }
    setGroups(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("customFieldGroups", JSON.stringify(updated));
    }
    setSelectedId(String(group.id));
  };

  const handleDelete = () => {
    if (!selectedId) return;
    const updated = groups.filter((g) => g.id !== selectedId);
    setGroups(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("customFieldGroups", JSON.stringify(updated));
    }

    const newSelected = updated.length ? String(updated[0].id) : null;
    setSelectedId(newSelected);
  };

  const selectedGroup = groups.find((g) => g.id === selectedId);

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
          data={groups.map((g) => ({ ...g, id: g.id ?? null }))}
          buttonText="Add Custom Field Group"
        />
        <Box flex={1}>
          <CustomFieldGroupDetails
            group={selectedGroup}
            onEdit={() => {
              setEditData(selectedGroup);
              setFormOpen(true);
            }}
            onDelete={handleDelete}
          />
        </Box>
        <CustomFieldGroupForm
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
