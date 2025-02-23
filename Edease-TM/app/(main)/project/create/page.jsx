"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { projectSchema } from "@/app/lib/validators";
import { createProject } from "@/actions/projects";
import { BarLoader } from "react-spinners";
import OrgSwitcher from "@/components/org-switcher";

export default function CreateProjectPage() {
  const router = useRouter();
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  const {
    loading,
    error,
    data: project,
    fn: createProjectFn,
  } = useFetch(createProject);

  const onSubmit = async (data) => {
    if (!isAdmin) {
      alert("Only organization admins can create projects");
      return;
    }

    createProjectFn(data);
  };

  useEffect(() => {
    if (project) router.push(`/project/${project.id}`);
  }, [loading]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title">
          Oops! Only Admins can create projects.
        </span>
        <OrgSwitcher />
      </div>
    );
  }
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <div className="w-[800px] p-10">
          <h1 className="text-5xl text-center font-bold mb-8 gradient-title">
            Create New Project
          </h1>
    
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-8"
          >
            <div>
              <Input
                id="name"
                {...register("name")}
                className="bg-slate-950 w-full px-4 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Project Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
              )}
            </div>
    
            <div>
              <Input
                id="key"
                {...register("key")}
                className="bg-slate-950 w-full px-4 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Project Key (Ex: RCYT)"
              />
              {errors.key && (
                <p className="text-red-500 text-sm mt-2">{errors.key.message}</p>
              )}
            </div>
    
            <div>
              <Textarea
                id="description"
                {...register("description")}
                className="bg-slate-950 w-full px-4 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none h-36"
                placeholder="Project Description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.description.message}
                </p>
              )}
            </div>
    
            {loading && (
              <BarLoader className="mb-6" width={"100%"} color="#36d7b7" />
            )}
    
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="bg-blue-500 text-white w-full px-4 py-3 rounded-lg hover:bg-purple-500"
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>
    
            {error && <p className="text-red-500 mt-4">{error.message}</p>}
          </form>
        </div>
      </div>
    );
    
}
