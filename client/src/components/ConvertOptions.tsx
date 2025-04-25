import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { 
  pdfMergeOptionsSchema, 
  imageToPdfOptionsSchema, 
  pdfToImageOptionsSchema, 
  imageConvertOptionsSchema 
} from "@shared/schema";

interface ConvertOptionsProps {
  type: "pdf-merge" | "image-to-pdf" | "pdf-to-image" | "image-convert";
  onSubmit: (data: any) => void;
  isProcessing: boolean;
  isDisabled: boolean;
}

const ConvertOptions = ({ type, onSubmit, isProcessing, isDisabled }: ConvertOptionsProps) => {
  let schema;
  let defaultValues;
  let buttonText = "";
  let buttonIcon = <FileText className="mr-2 h-4 w-4" />;
  
  switch (type) {
    case "pdf-merge":
      schema = pdfMergeOptionsSchema;
      defaultValues = {
        outputFilename: "Merged_Document",
        pageSize: "original",
        addBookmarks: false,
      };
      buttonText = "Merge PDFs";
      break;
    case "image-to-pdf":
      schema = imageToPdfOptionsSchema;
      defaultValues = {
        outputFilename: "Images_to_PDF",
        pageSize: "a4",
        pageOrientation: "portrait",
        imageQuality: 90,
      };
      buttonText = "Convert to PDF";
      break;
    case "pdf-to-image":
      schema = pdfToImageOptionsSchema;
      defaultValues = {
        outputFormat: "jpg",
        imageQuality: 90,
        dpi: 150,
      };
      buttonText = "Extract Images";
      break;
    case "image-convert":
      schema = imageConvertOptionsSchema;
      defaultValues = {
        outputFormat: "png",
        quality: 90,
        maintainAspectRatio: true,
      };
      buttonText = "Convert Images";
      break;
  }

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <div className="mt-10 p-6 bg-background rounded-lg">
      <h3 className="text-lg font-bold font-inter mb-4">
        {type === "pdf-merge" 
          ? "Merge Options" 
          : type === "image-to-pdf" 
            ? "PDF Options" 
            : type === "pdf-to-image" 
              ? "Image Options" 
              : "Conversion Options"}
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(type === "pdf-merge" || type === "image-to-pdf") && (
              <FormField
                control={form.control}
                name="outputFilename"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Output File Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {type === "pdf-merge" && (
              <FormField
                control={form.control}
                name="pageSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Size</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isDisabled}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select page size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="original">Original size (from first PDF)</SelectItem>
                        <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                        <SelectItem value="letter">US Letter (8.5 × 11 in)</SelectItem>
                        <SelectItem value="legal">US Legal (8.5 × 14 in)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}

            {type === "image-to-pdf" && (
              <>
                <FormField
                  control={form.control}
                  name="pageSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Size</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select page size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                          <SelectItem value="letter">US Letter (8.5 × 11 in)</SelectItem>
                          <SelectItem value="legal">US Legal (8.5 × 14 in)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pageOrientation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orientation</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select orientation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="portrait">Portrait</SelectItem>
                          <SelectItem value="landscape">Landscape</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </>
            )}

            {type === "pdf-to-image" && (
              <>
                <FormField
                  control={form.control}
                  name="outputFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output Format</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dpi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resolution (DPI)</FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => field.onChange(Number(value))}
                        disabled={isDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select DPI" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="72">72 DPI (Screen)</SelectItem>
                          <SelectItem value="150">150 DPI (Standard)</SelectItem>
                          <SelectItem value="300">300 DPI (Print)</SelectItem>
                          <SelectItem value="600">600 DPI (High Quality)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </>
            )}

            {type === "image-convert" && (
              <>
                <FormField
                  control={form.control}
                  name="outputFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output Format</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                          <SelectItem value="gif">GIF</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quality</FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => field.onChange(Number(value))}
                        disabled={isDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="60">Low (60%)</SelectItem>
                          <SelectItem value="80">Medium (80%)</SelectItem>
                          <SelectItem value="90">High (90%)</SelectItem>
                          <SelectItem value="100">Maximum (100%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          {type === "pdf-merge" && (
            <div className="mt-6">
              <FormField
                control={form.control}
                name="addBookmarks"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isDisabled}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Add bookmarks for each merged file</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          {type === "image-convert" && (
            <div className="mt-6">
              <FormField
                control={form.control}
                name="maintainAspectRatio"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isDisabled}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Maintain aspect ratio</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="mt-10 text-center">
            <Button
              type="submit"
              className="px-8 py-3 bg-primary hover:bg-blue-700 text-white text-lg"
              disabled={isProcessing || isDisabled}
            >
              {buttonIcon} {buttonText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ConvertOptions;
