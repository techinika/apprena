import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Curriculum, Module } from "@/types/Course";
import { Play, FileText } from "lucide-react";

export function CurriculumAccordion({
  curriculum,
}: {
  curriculum: Curriculum | undefined;
}) {
  return (
    <Accordion
      type="multiple"
      className="w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-md"
    >
      {curriculum ? (
        curriculum.modules.map((module: Module, i) => (
          <AccordionItem key={i + 1} value={`module-${i + 1}`}>
            <AccordionTrigger className="justify-between text-left">
              <div>
                <p className="font-semibold">{module.moduleTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {module.lectures} lectures • {module.duration}
                </p>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-2 mt-2">
                {module.lessons.map((lesson, j) => (
                  <div
                    key={j + 1}
                    className="flex items-center justify-between p-2 border rounded-md bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      {lesson.type === "video" ? (
                        <Play size={16} />
                      ) : (
                        <FileText size={16} />
                      )}
                      <span>{lesson.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {lesson.duration ?? lesson.size}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))
      ) : (
        <p className="text-center py-5">No curriculum added!</p>
      )}
    </Accordion>
  );
}
