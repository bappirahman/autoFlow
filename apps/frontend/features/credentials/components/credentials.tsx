"use client";

import { formatDistanceToNow } from "date-fns";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-component";
import { AnthropicIcon } from "@/components/icons/anthropic-icon";
import { GeminiIcon } from "@/components/icons/gemini-icon";
import { OpenaiIcon } from "@/components/icons/openai-icon";
import {
  useSuspenseCredentials,
  useRemoveCredential,
} from "@/features/credentials/hooks/use-credentials";
import { useCredentialsParams } from "@/features/credentials/hooks/use-credentials-params";
import type { Credential, CredentialType } from "@/features/credentials/types/credential";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useRouter } from "next/navigation";

const TYPE_LABELS: Record<CredentialType, string> = {
  OPENAI: "OpenAI",
  ANTHROPIC: "Anthropic",
  GEMINI: "Gemini",
};

const ProviderIcon = ({ type }: { type: CredentialType }) => {
  const cls = "size-5 text-muted-foreground";
  if (type === "OPENAI") return <OpenaiIcon className={cls} />;
  if (type === "ANTHROPIC") return <AnthropicIcon className={cls} />;
  return <GeminiIcon className={cls} />;
};

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });
  return (
    <EntitySearch
      placeholder="Search credentials..."
      value={searchValue}
      onChange={onSearchChange}
    />
  );
};

export const CredentialsList = () => {
  const { data } = useSuspenseCredentials();
  const router = useRouter();

  if (data.items.length === 0) {
    return (
      <EmptyView
        message="No credentials yet. Add an API key to connect AI providers to your workflows."
        onNew={() => router.push("/credentials/new")}
      />
    );
  }

  return (
    <EntityList
      items={data.items}
      getKey={(c) => c.id}
      renderItem={(c) => <CredentialItem credential={c} />}
    />
  );
};

const CredentialItem = ({ credential }: { credential: Credential }) => {
  const remove = useRemoveCredential();

  return (
    <EntityItem
      title={credential.name}
      subtitle={
        <>
          {TYPE_LABELS[credential.type]} &bull; Updated{" "}
          {formatDistanceToNow(new Date(credential.updatedAt), { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <ProviderIcon type={credential.type} />
        </div>
      }
      onRemove={() => remove.mutate({ id: credential.id })}
      isRemoving={remove.isPending}
    />
  );
};

export const CredentialsPagination = () => {
  const { data, isFetching } = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      disabled={isFetching}
      totalPages={data.totalPages}
      page={data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const CredentialsHeader = () => (
  <EntityHeader
    title="Credentials"
    description="Manage your API keys for AI providers"
    OnNewButtonHref="/credentials/new"
    OnNewButtonLabel="Add credential"
  />
);

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <EntityContainer
    header={<CredentialsHeader />}
    search={<CredentialsSearch />}
    pagination={<CredentialsPagination />}
  >
    {children}
  </EntityContainer>
);

export const CredentialsLoading = () => (
  <LoadingView entity="credentials" message="Loading credentials..." />
);

export const CredentialsError = () => (
  <ErrorView message="Failed to load credentials." />
);
