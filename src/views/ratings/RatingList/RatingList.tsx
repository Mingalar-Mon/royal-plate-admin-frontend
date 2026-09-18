import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import dayjs from 'dayjs'
import {
    TbCheck,
    TbEdit,
    TbMessageCircle,
    TbRefresh,
    TbSearch,
    TbTrash,
} from 'react-icons/tb'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Pagination from '@/components/ui/Pagination'
import { useRatingStore } from '@/store/ratingStore'
import type { Rating, } from '@/services/RatingService'
import {
    useDeleteRatingOwnerResponse,
    useRatings,
    useSaveRatingOwnerResponse,
} from '@/utils/custom-hooks/useRating'

const formatDate = (date?: string | null) =>
    date ? dayjs(date).format('DD MMM YYYY') : '-'

const RatingStars = ({ score }: { score: number | string }) => {
    const numericScore = Number(score)
    const safeScore = Number.isFinite(numericScore)
        ? Math.max(0, Math.min(5, numericScore))
        : 0

    return (
        <div
            className="flex items-center gap-1"
            aria-label={`${safeScore} out of 5 stars`}
        >
            <div className="flex items-center" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1
                    const isFull = safeScore >= starValue
                    const isHalf = !isFull && safeScore >= starValue - 0.5

                    return (
                        <span
                            key={starValue}
                            className={
                                isFull
                                    ? 'text-base leading-none text-amber-400'
                                    : isHalf
                                      ? 'bg-gradient-to-r from-amber-400 from-50% to-gray-300 to-50% bg-clip-text text-base leading-none text-transparent dark:to-gray-600'
                                      : 'text-base leading-none text-gray-300 dark:text-gray-600'
                            }
                        >
                            ★
                        </span>
                    )
                })}
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {safeScore.toFixed(1)}
            </span>
        </div>
    )
}

const Reviewer = ({ rating }: { rating: Rating }) => (
    <div className="min-w-0">
        <p className="truncate font-semibold text-gray-900 dark:text-gray-100">
            {rating.user?.name || 'Anonymous guest'}
        </p>
        <p className="truncate text-xs text-gray-500">
            {rating.user?.email || rating.user?.phone || 'Verified reviewer'}
        </p>
    </div>
)

const RatingList = () => {
    const { restaurantId } = useParams()
    const tableData = useRatingStore((state) => state.tableData)
    const setTableData = useRatingStore((state) => state.setTableData)
    const { ratings, total, isLoading, isFetching, refetch } = useRatings({
        restaurantId,
        params: tableData,
    })
    const saveResponse = useSaveRatingOwnerResponse()
    const deleteResponse = useDeleteRatingOwnerResponse()
    const [editingRating, setEditingRating] = useState<Rating | null>(null)
    const [responseText, setResponseText] = useState('')
    const [deleteTarget, setDeleteTarget] = useState<Rating | null>(null)

    const visibleRatings = useMemo(() => {
        if (tableData.response === 'pending') {
            return ratings.filter((rating) => !rating.ownerResponse)
        }
        if (tableData.response === 'replied') {
            return ratings.filter((rating) => Boolean(rating.ownerResponse))
        }
        return ratings
    }, [ratings, tableData.response])

    const openEditor = (rating: Rating) => {
        setEditingRating(rating)
        setResponseText(rating.ownerResponse || '')
    }

    const closeEditor = () => {
        if (!saveResponse.isPending) setEditingRating(null)
    }

    const handleSave = () => {
        if (!editingRating || !responseText.trim() || responseText.length > 1000) {
            return
        }
        saveResponse.mutate(
            { ratingId: editingRating.id, ownerResponse: responseText.trim() },
            { onSuccess: () => setEditingRating(null) },
        )
    }

    const confirmDelete = () => {
        if (!deleteTarget) return
        deleteResponse.mutate(deleteTarget.id, {
            onSettled: () => setDeleteTarget(null),
        })
    }

    return (
        <Container>
            <AdaptiveCard>
                <div className="space-y-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <TbMessageCircle className="text-2xl text-primary" />
                                <h3 className="text-primary">Guest ratings</h3>
                            </div>
                            <p className="mt-1 text-gray-500">
                                Thank guests for their feedback and show that every review matters.
                            </p>
                        </div>
                        <Button
                            size="sm"
                            icon={<TbRefresh />}
                            loading={isFetching}
                            onClick={() => refetch()}
                        >
                            Refresh
                        </Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                        <Input
                            value={tableData.query}
                            placeholder="Search reviews or reviewers"
                            suffix={<TbSearch className="text-lg" />}
                            onChange={(event) =>
                                setTableData((previous) => ({
                                    ...previous,
                                    query: event.target.value,
                                    pageIndex: 1,
                                }))
                            }
                        />
                        <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
                            {(['all', 'pending', 'replied'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition ${
                                        tableData.response === filter
                                            ? 'bg-white text-primary shadow-sm dark:bg-gray-700'
                                            : 'text-gray-500 hover:text-primary'
                                    }`}
                                    onClick={() =>
                                        setTableData((previous) => ({
                                            ...previous,
                                            response: filter,
                                            pageIndex: 1,
                                        }))
                                    }
                                >
                                    {filter === 'all' ? 'All reviews' : filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
                            ))}
                        </div>
                    ) : visibleRatings.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-14 text-center dark:border-gray-700">
                            <TbMessageCircle className="mx-auto mb-3 text-4xl text-gray-300" />
                            <h5 className="font-semibold">No reviews found</h5>
                            <p className="mt-1 text-sm text-gray-500">
                                New guest feedback will appear here.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 md:block">
                                <table className="w-full min-w-[850px] table-fixed text-left">
                                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-800/70">
                                        <tr>
                                            <th className="w-[18%] px-4 py-3">Guest</th>
                                            <th className="w-[25%] px-4 py-3">Review</th>
                                            <th className="w-[28%] px-4 py-3">Response</th>
                                            <th className="w-[17%] px-4 py-3">Dates</th>
                                            <th className="w-[12%] px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {visibleRatings.map((rating) => (
                                            <tr key={rating.id} className="align-top hover:bg-gray-50/70 dark:hover:bg-gray-800/40">
                                                <td className="min-w-0 px-4 py-4"><Reviewer rating={rating} /></td>
                                                <td className="min-w-0 px-4 py-4">
                                                    <RatingStars score={rating.score} />
                                                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-600 dark:text-gray-300">{rating.review || 'No written comment'}</p>
                                                </td>
                                                <td className="min-w-0 px-4 py-4">
                                                    {rating.ownerResponse ? (
                                                        <div className="min-w-0 rounded-lg bg-primary/5 p-3 text-sm text-gray-700 dark:bg-primary/10 dark:text-gray-200">
                                                            <Badge content="Replied" innerClass="bg-emerald-500" />
                                                            <p className="mt-2 whitespace-pre-wrap break-words">{rating.ownerResponse}</p>
                                                        </div>
                                                    ) : <Badge content="Pending" innerClass="bg-amber-500" />}
                                                </td>
                                                <td className="break-words px-4 py-4 text-xs text-gray-500">
                                                    <p>Reviewed {formatDate(rating.created_at)}</p>
                                                    {rating.ownerRespondedAt && <p className="mt-1">Replied {formatDate(rating.ownerRespondedAt)}</p>}
                                                </td>
                                                <td className="px-4 py-4 text-left align-top">
                                                    <ResponseActions rating={rating} onEdit={openEditor} onDelete={setDeleteTarget} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid gap-4 md:hidden">
                                {visibleRatings.map((rating) => (
                                    <div key={rating.id} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                                        <div className="flex items-start justify-between gap-3"><Reviewer rating={rating} /><RatingStars score={rating.score} /></div>
                                        <p className="mt-4 whitespace-pre-wrap break-words text-sm text-gray-600 dark:text-gray-300">{rating.review || 'No written comment'}</p>
                                        <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-700">
                                            {rating.ownerResponse ? <><div className="flex items-center justify-between"><Badge content="Replied" innerClass="bg-emerald-500" /><span className="text-xs text-gray-500">{formatDate(rating.ownerRespondedAt)}</span></div><p className="mt-2 whitespace-pre-wrap break-words text-sm">{rating.ownerResponse}</p></> : <Badge content="Pending" innerClass="bg-amber-500" />}
                                        </div>
                                        <div className="mt-4 flex flex-wrap justify-end gap-2"><ResponseActions rating={rating} onEdit={openEditor} onDelete={setDeleteTarget} /></div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <Pagination
                                    pageSize={tableData.pageSize}
                                    currentPage={tableData.pageIndex}
                                    total={total}
                                    onChange={(page) => setTableData((previous) => ({ ...previous, pageIndex: page }))}
                                />
                            </div>
                        </>
                    )}
                </div>
            </AdaptiveCard>

            <Dialog isOpen={Boolean(editingRating)} onClose={closeEditor} onRequestClose={closeEditor} width={560}>
                {editingRating && <div className="p-6">
                    <div className="mb-5 flex items-start gap-3"><div className="rounded-xl bg-primary/10 p-3 text-primary"><TbMessageCircle className="text-xl" /></div><div><h4>{editingRating.ownerResponse ? 'Edit your response' : 'Reply to this review'}</h4><p className="mt-1 text-sm text-gray-500">Your reply will be visible to the guest and they will be notified.</p></div></div>
                    <div className="mb-4 rounded-xl bg-gray-50 p-4 text-sm dark:bg-gray-800"><RatingStars score={editingRating.score} /><p className="mt-2 whitespace-pre-wrap text-gray-600 dark:text-gray-300">{editingRating.review || 'No written comment'}</p></div>
                    <label className="mb-2 block text-sm font-semibold">Your response</label>
                    <Input textArea rows={6} maxLength={1000} value={responseText} placeholder="Write a warm, professional response..." onChange={(event) => setResponseText(event.target.value)} />
                    <div className="mt-2 flex justify-between text-xs text-gray-500"><span>Keep it helpful and respectful.</span><span>{responseText.length}/1000</span></div>
                    <div className="mt-6 flex justify-end gap-2"><Button disabled={saveResponse.isPending} onClick={closeEditor}>Cancel</Button><Button variant="solid" loading={saveResponse.isPending} disabled={!responseText.trim() || responseText.length > 1000} icon={<TbCheck />} onClick={handleSave}>Publish reply</Button></div>
                </div>}
            </Dialog>

            <Dialog isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onRequestClose={() => setDeleteTarget(null)} width={440}>
                {deleteTarget && <div className="p-6"><div className="mb-4 flex items-center gap-3"><div className="rounded-xl bg-red-50 p-3 text-red-500 dark:bg-red-950/30"><TbTrash className="text-xl" /></div><h4>Remove your response?</h4></div><p className="text-sm leading-6 text-gray-600 dark:text-gray-300">The guest will still see their original review, but your response will be removed.</p><div className="mt-6 flex justify-end gap-2"><Button disabled={deleteResponse.isPending} onClick={() => setDeleteTarget(null)}>Keep response</Button><Button variant="solid" loading={deleteResponse.isPending} className="!bg-red-500 hover:!bg-red-600" onClick={confirmDelete}>Remove response</Button></div></div>}
            </Dialog>
        </Container>
    )
}

const ResponseActions = ({ rating, onEdit, onDelete }: { rating: Rating; onEdit: (rating: Rating) => void; onDelete: (rating: Rating) => void }) => (
    <div className="flex w-full items-center justify-start gap-2 whitespace-nowrap">
        <Button size="xs" variant={rating.ownerResponse ? 'default' : 'solid'} icon={rating.ownerResponse ? <TbEdit /> : <TbMessageCircle />} iconAlignment="end" onClick={() => onEdit(rating)}>{rating.ownerResponse ? 'Edit' : 'Reply'}</Button>
        {rating.ownerResponse && <Button size="xs" variant="plain" icon={<TbTrash />} aria-label="Remove response" onClick={() => onDelete(rating)} />}
    </div>
)

export default RatingList
