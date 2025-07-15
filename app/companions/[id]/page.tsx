"use client";

import {getCompanion} from "@/lib/actions/companion.actions";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import {getSubjectColor} from "@/lib/utils";
import Image from "next/image";
import dynamic from "next/dynamic";
import {useEffect, useState} from "react";

const CompanionComponent = dynamic(() => import("@/components/CompanionComponent"), {
    loading: () => (
        <div className="companion-chat-container">
            <div className="h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Loading companion...</div>
            </div>
        </div>
    ),
    ssr: false
});

interface Companion {
    id: string;
    name: string;
    subject: string;
    topic: string;
    duration: number;
    description?: string;
    instructions?: string;
    seed?: string;
    src?: string;
    userId?: string;
    userName?: string;
    createdAt?: Date;
    updatedAt?: Date;
    _count?: {
        messages: number;
    };
}

interface CompanionSessionPageProps {
    params: Promise<{ id: string}>;
}

const CompanionSession = ({ params }: CompanionSessionPageProps) => {
    const { user } = useUser();
    const router = useRouter();
    const [companion, setCompanion] = useState<Companion | null>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>('');

    useEffect(() => {
        const getParamsAndData = async () => {
            try {
                const resolvedParams = await params;
                const companionId = resolvedParams.id;
                setId(companionId);
                
                const companionData = await getCompanion(companionId);
                setCompanion(companionData);
            } catch (error) {
                console.error('Error fetching companion:', error);
                router.push('/companions');
            } finally {
                setLoading(false);
            }
        };

        getParamsAndData();
    }, [params, router]);

    useEffect(() => {
        if (!user && !loading) {
            router.push('/sign-in');
        }
        if (companion && !companion.name) {
            router.push('/companions');
        }
    }, [user, companion, loading, router]);

    if (loading || !companion || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading companion...</p>
                </div>
            </div>
        );
    }

    const { name, subject, topic, duration } = companion;

    return (
        <main>
            <article className="flex rounded-border justify-between p-6 max-md:flex-col">
                <div className="flex items-center gap-2">
                    <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{ backgroundColor: getSubjectColor(subject)}}>
                        <Image src={`/icons/${subject}.svg`} alt={subject} width={35} height={35} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-2xl">
                                {name}
                            </p>
                            <div className="subject-badge max-sm:hidden">
                                {subject}
                            </div>
                        </div>
                        <p className="text-lg">{topic}</p>
                    </div>
                </div>
                <div className="items-start text-2xl max-md:hidden">
                    {duration} minutes
                </div>
            </article>

            <CompanionComponent
                {...companion}
                companionId={id}
                userName={user.firstName!}
                userImage={user.imageUrl!}
            />
        </main>
    )
}

export default CompanionSession
