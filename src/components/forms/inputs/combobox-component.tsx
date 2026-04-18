"use client";

import {Controller, useFormContext} from "react-hook-form";
import ErrorMessage from "@/components/ui/error-message";
import {Label} from "@/components/ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

/* ========================================
   = Props =
========================================= */
interface ComboboxComponentProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  clearable?: boolean;
  options?: {value: string | number; label: string}[];
  // Modo controlado (sin FormProvider)
  value?: string;
  onChange?: (value: string | null) => void;
}

const inputGroupClass =
  "h-auto! w-full border-gray/80 px-0 py-0 font-heading text-base md:text-sm";

function buildItems(options: {value: string | number; label: string}[]) {
  const items = options.map((o) => String(o.value));
  const labelMap: Record<string, string> = Object.fromEntries(
    options.map((o) => [String(o.value), o.label])
  );
  const itemToStringLabel = (val: unknown) =>
    val ? (labelMap[String(val)] ?? String(val)) : "";
  return {items, labelMap, itemToStringLabel};
}

/* ── Componente interno: solo se monta dentro de un FormProvider ── */
function ComboboxFormConnected({
  name,
  label,
  required,
  placeholder,
  clearable,
  options = [],
}: Omit<ComboboxComponentProps, "value" | "onChange">) {
  const {
    control,
    formState: {errors},
  } = useFormContext();
  const errorMessage = errors[name]?.message as string | undefined;
  const {items, labelMap, itemToStringLabel} = buildItems(options);

  return (
    <div className='space-y-2'>
      {label && (
        <div className='flex gap-2'>
          <Label htmlFor={name}>{label}</Label>
          {required && <span className='text-red-500'>*</span>}
        </div>
      )}
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <Combobox
            items={items}
            value={field.value ?? ""}
            onValueChange={(val) => {
              field.onChange(val ?? "");
              field.onBlur();
            }}
            itemToStringLabel={itemToStringLabel}
          >
            <ComboboxInput
              placeholder={placeholder}
              showClear={clearable && !!field.value}
              className={inputGroupClass}
            />
            <ComboboxContent>
              <ComboboxEmpty>No hay resultados.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {labelMap[item] ?? item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        )}
      />
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
}

/* ── Componente público ─────────────────────────────────────── */
export default function ComboboxComponent({
  name,
  label,
  required = false,
  placeholder,
  clearable = true,
  options = [],
  value,
  onChange,
}: ComboboxComponentProps) {
  const {items, labelMap, itemToStringLabel} = buildItems(options);

  // Modo controlado: value/onChange provistos → no necesita FormProvider
  if (value !== undefined || onChange !== undefined) {
    return (
      <div className='space-y-2'>
        {label && (
          <div className='flex gap-2'>
            <Label htmlFor={name}>{label}</Label>
            {required && <span className='text-red-500'>*</span>}
          </div>
        )}
        <Combobox
          items={items}
          value={value ?? ""}
          onValueChange={(val) => onChange?.(val as string | null)}
          itemToStringLabel={itemToStringLabel}
        >
          <ComboboxInput
            placeholder={placeholder}
            showClear={clearable && !!value}
            className={inputGroupClass}
          />
          <ComboboxContent>
            <ComboboxEmpty>No hay resultados.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {labelMap[item] ?? item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    );
  }

  // Modo formulario: delega a ComboboxFormConnected que usa useFormContext
  return (
    <ComboboxFormConnected
      name={name}
      label={label}
      required={required}
      placeholder={placeholder}
      clearable={clearable}
      options={options}
    />
  );
}
