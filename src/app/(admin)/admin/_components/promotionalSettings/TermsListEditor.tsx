"use client";

import { useState } from "react";
import { Plus, Trash, ArrowUp, ArrowDown, ListCollapse, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TermsListEditorProps {
    terms: string[];
    onChange: (terms: string[]) => void;
}

export default function TermsListEditor({ terms, onChange }: TermsListEditorProps) {
    const [newTerm, setNewTerm] = useState("");

    const handleAddTerm = () => {
        if (!newTerm.trim()) return;
        onChange([...terms, newTerm.trim()]);
        setNewTerm("");
    };

    const handleUpdateTerm = (index: number, val: string) => {
        const updated = [...terms];
        updated[index] = val;
        onChange(updated);
    };

    const handleDeleteTerm = (index: number) => {
        onChange(terms.filter((_, i) => i !== index));
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const updated = [...terms];
        const temp = updated[index];
        updated[index] = updated[index - 1];
        updated[index - 1] = temp;
        onChange(updated);
    };

    const handleMoveDown = (index: number) => {
        if (index === terms.length - 1) return;
        const updated = [...terms];
        const temp = updated[index];
        updated[index] = updated[index + 1];
        updated[index + 1] = temp;
        onChange(updated);
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-white/2 p-5 md:p-6 space-y-6">
            <div className="space-y-1">
                <label className="text-sm font-semibold tracking-wide text-white uppercase flex items-center gap-1.5">
                    <ListCollapse className="h-4 w-4 text-[#ff49ff]" />
                    Terms & Conditions List
                </label>
                <p className="text-xs text-white/55">
                    Customize the detailed terms and conditions shown to users in the Terms Modal.
                </p>
            </div>

            {/* Terms List */}
            <div className="space-y-3">
                {terms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-white/15 bg-black/20 text-center space-y-2">
                        <AlertCircle className="h-6 w-6 text-white/30" />
                        <p className="text-sm font-medium text-white/50">No terms configured</p>
                        <p className="text-xs text-white/40">Add terms using the input below to show them to your users.</p>
                    </div>
                ) : (
                    terms.map((term, index) => (
                        <div
                            key={index}
                            className="group flex flex-col sm:flex-row gap-3 items-stretch sm:items-center p-3 rounded-xl border border-white/5 bg-black/30 hover:border-white/15 hover:bg-black/50 transition-all duration-200"
                        >
                            {/* Term Index Badge */}
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#ff49ff]/10 text-xs font-bold text-[#ff49ff] border border-[#ff49ff]/20">
                                {index + 1}
                            </span>

                            {/* Term Input */}
                            <input
                                type="text"
                                value={term}
                                onChange={(e) => handleUpdateTerm(index, e.target.value)}
                                className="flex-1 min-w-0 bg-transparent py-1 text-sm text-white outline-none border-b border-transparent focus:border-white/20 transition-all"
                            />

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-1.5 border-t border-white/5 pt-2 sm:border-t-0 sm:pt-0">
                                <button
                                    type="button"
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0}
                                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                                    title="Move Up"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === terms.length - 1}
                                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                                    title="Move Down"
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </button>
                                <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteTerm(index)}
                                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition cursor-pointer"
                                    title="Delete Term"
                                >
                                    <Trash className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add New Term Form */}
            <div className="flex gap-2 pt-2 border-t border-white/5">
                <input
                    type="text"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTerm();
                        }
                    }}
                    placeholder="Type a new term or condition statement..."
                    className="flex-1 h-11 rounded-xl border border-white/10 bg-[#161616] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#ff49ff]"
                />
                <Button
                    type="button"
                    onClick={handleAddTerm}
                    disabled={!newTerm.trim()}
                    className="h-11 px-4 bg-[#ff49ff] text-white hover:bg-[#ff6aff] active:scale-[0.98] disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                </Button>
            </div>
        </div>
    );
}
