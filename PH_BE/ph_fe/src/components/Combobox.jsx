import React, { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, CirclePlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const toHiragana = (value) => {
  return value.replace(/[\u30a1-\u30f6]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 0x60);
  });
};

const CommandAddItem = ({ query, onCreate }) => {
  return (
    <div
      tabIndex={0}
      onClick={onCreate}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onCreate();
        }
      }}
      className={cn(
        'flex w-full text-blue-500 cursor-pointer text-sm px-2 py-1.5 rounded-sm items-center focus:outline-none',
        'hover:bg-blue-200 focus:!bg-blue-200'
      )}
    >
      <CirclePlus className="mr-2 h-4 w-4" />
      Create "{query}"
    </div>
  );
};

export const Combobox = ({
  options = [], // Default to empty array if not provided
  selected,
  className,
  placeholder,
  disabled,
  onChange,
  onCreate,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [canCreate, setCanCreate] = useState(true);

  useEffect(() => {
    const isAlreadyCreated = !options.some((option) => option.label === query);
    setCanCreate(!!(query && isAlreadyCreated));
  }, [query, options]);

  const handleSelect = (option) => {
    if (onChange) {
      onChange(option);
      setOpen(false);
      setQuery('');
    }
  };

  const handleCreate = () => {
    if (onCreate && query) {
      onCreate(query);
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          disabled={disabled ?? false}
          aria-expanded={open}
          className={cn('w-full font-normal', className)}
        >
          {selected && selected.length > 0 ? (
            <div className="truncate mr-auto">
              {options.find((item) => item.value === selected)?.label}
            </div>
          ) : (
            <div className="text-slate-600 mr-auto">
              {placeholder ?? 'Select'}
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[500px] p-0">
        <Command
          filter={(value, search) => {
            const v = toHiragana(value.toLocaleLowerCase());
            const s = toHiragana(search.toLocaleLowerCase());
            if (v.includes(s)) return 1;
            return 0;
          }}
        >
          <CommandInput
            placeholder="Search or create new"
            value={query}
            onValueChange={(value) => setQuery(value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
            }}
          />
          <CommandEmpty className="flex pl-1 py-1 w-full">
            {query && (
              <CommandAddItem query={query} onCreate={() => handleCreate()} />
            )}
          </CommandEmpty>

          <CommandList>
            <CommandGroup className="overflow-y-auto">
              {options.length === 0 && !query && (
                <div className="py-1.5 pl-8 space-y-1 text-sm">
                  <p>No items</p>
                  <p>Enter a value to create a new one</p>
                </div>
              )}

              {canCreate && (
                <CommandAddItem query={query} onCreate={() => handleCreate()} />
              )}

              {options.map((option, index) => (
                <CommandItem
                  key={`${option.label}-${index}`} // Ensure unique key
                  tabIndex={0}
                  value={option.label}
                  onSelect={() => handleSelect(option)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.stopPropagation();
                      handleSelect(option);
                    }
                  }}
                  className={cn(
                    'cursor-pointer',
                    'focus:!bg-blue-200 hover:!bg-blue-200 aria-selected:bg-transparent'
                  )}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 min-h-4 min-w-4',
                      selected === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};