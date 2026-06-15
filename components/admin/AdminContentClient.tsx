"use client";

import { useState, useRef, useEffect } from "react";
import { updateContent } from "@/app/admin/content/actions";

interface ContentItem {
  key: string;
  title: string;
  type: string;
  value: string;
  updatedAt: Date | string;
}

export default function AdminContentClient({ initialContent }: { initialContent: ContentItem[] }) {
  const [contentItems, setContentItems] = useState(initialContent);
  const [activeKey, setActiveKey] = useState(initialContent[0]?.key || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const activeItem = contentItems.find(c => c.key === activeKey);

  const [editorValue, setEditorValue] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeItem) {
      setEditorValue(activeItem.value);
      if (editorRef.current) {
        editorRef.current.innerHTML = activeItem.value;
      }
    }
  }, [activeKey, activeItem]);

  const handleInput = () => {
    if (editorRef.current) {
      setEditorValue(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const handleSave = async () => {
    if (!activeItem) return;
    setIsSaving(true);
    setMessage("");

    const result = await updateContent(activeItem.key, editorValue);
    
    setIsSaving(false);
    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage("Saved successfully!");
      // Update local state
      setContentItems(items => items.map(item => 
        item.key === activeKey 
          ? { ...item, value: editorValue, updatedAt: new Date() } 
          : item
      ));
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!initialContent || initialContent.length === 0) {
    return <div className="p-8">No content sections defined in database.</div>;
  }

  return (
    <div className="-mx-4 md:-mx-8 -mt-4 md:-mt-8 -mb-12 h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-white">
      {/* Sidebar: Content Keys */}
      <aside className="w-full md:w-80 h-48 md:h-full border-b md:border-b-0 md:border-r border-border bg-white flex flex-col flex-shrink-0">
        <div className="p-4 md:p-6 border-b border-border flex justify-between items-center">
          <h2 className="font-headline-h3 text-primary">Content Keys</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {contentItems.map((item) => (
            <button 
              key={item.key}
              onClick={() => setActiveKey(item.key)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all group ${
                activeKey === item.key 
                  ? "border-secondary-container bg-muted/50" 
                  : "border-transparent hover:bg-surface-container"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${activeKey === item.key ? "text-secondary" : "text-muted-foreground group-hover:text-secondary"}`}>
                  {item.type}
                </span>
                <span className="text-[10px] text-muted-foreground" suppressHydrationWarning>
                  {new Date(item.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="font-bold text-primary mb-1">{item.title}</p>
              <p className="text-caption text-muted-foreground line-clamp-1">{item.value.replace(/<[^>]+>/g, '')}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Editor Section */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Editor Header */}
        <div className="px-4 md:px-8 py-4 md:py-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <nav className="flex text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 gap-2">
              <span>CMS</span>
              <span>/</span>
              <span className="text-secondary">Editing</span>
            </nav>
            <h2 className="font-headline-h2 text-primary">{activeItem?.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            {message && <span className="text-sm font-medium text-success">{message}</span>}
            <button 
              onClick={() => {
                setEditorValue(activeItem?.value || "");
                if (editorRef.current) editorRef.current.innerHTML = activeItem?.value || "";
              }}
              className="px-4 py-2 text-muted-foreground font-label-button border border-border rounded-full hover:bg-surface-container-low transition-colors"
            >
              Discard
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-primary-container text-on-primary font-label-button rounded-full hover:opacity-90 shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]" data-icon="save">save</span>
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 md:px-8 py-3 border-b border-border bg-surface-container-low/30 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
          <button onClick={() => execCmd('bold')} className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface" title="Bold">
            <span className="material-symbols-outlined text-[20px]" data-icon="format_bold">format_bold</span>
          </button>
          <button onClick={() => execCmd('italic')} className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface" title="Italic">
            <span className="material-symbols-outlined text-[20px]" data-icon="format_italic">format_italic</span>
          </button>
          <div className="h-6 w-[1px] bg-border mx-1"></div>
          <button onClick={() => execCmd('formatBlock', 'H2')} className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface" title="Heading">
            <span className="material-symbols-outlined text-[20px]" data-icon="format_h2">format_h2</span>
          </button>
          <button onClick={() => execCmd('formatBlock', 'P')} className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface" title="Paragraph">
            <span className="material-symbols-outlined text-[20px]" data-icon="format_paragraph">segment</span>
          </button>
          <div className="h-6 w-[1px] bg-border mx-1"></div>
          <button onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface" title="Bullet List">
            <span className="material-symbols-outlined text-[20px]" data-icon="format_list_bulleted">format_list_bulleted</span>
          </button>
        </div>

        {/* Editor Body */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-surface-container-lowest">
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            <div 
              ref={editorRef}
              onInput={handleInput}
              contentEditable
              suppressContentEditableWarning
              className="w-full flex-1 p-8 rounded-xl border border-border focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-white shadow-sm prose prose-neutral max-w-none 
                         [&>h2]:font-headline-h2 [&>h2]:text-primary [&>h2]:mb-4 [&>h2]:mt-6 
                         [&>p]:font-body-md [&>p]:text-on-surface-variant [&>p]:mb-4
                         [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul>li]:text-on-surface-variant"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
