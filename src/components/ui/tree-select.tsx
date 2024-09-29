"use client";

import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface TreeNode {
	id: string;
	label: string;
	children?: TreeNode[];
}

const treeData: TreeNode[] = [
	{
		id: "0-0",
		label: "0-0",
		children: [
			{
				id: "0-0-0",
				label: "0-0-0",
				children: [
					{ id: "0-0-0-0", label: "0-0-0-0" },
					{ id: "0-0-0-1", label: "0-0-0-1" },
					{ id: "0-0-0-2", label: "0-0-0-2" },
				],
			},
			{
				id: "0-0-1",
				label: "0-0-1",
				children: [
					{ id: "0-0-1-0", label: "0-0-1-0" },
					{ id: "0-0-1-1", label: "0-0-1-1" },
					{ id: "0-0-1-2", label: "0-0-1-2" },
				],
			},
			{ id: "0-0-2", label: "0-0-2" },
		],
	},
	{
		id: "0-1",
		label: "0-1",
		children: [
			{ id: "0-1-0-0", label: "0-1-0-0" },
			{ id: "0-1-0-1", label: "0-1-0-1" },
			{ id: "0-1-0-2", label: "0-1-0-2" },
		],
	},
	{ id: "0-2", label: "0-2" },
];

function TreeNode({
	node,
	level = 0,
	onCheck,
	checkedState,
}: {
	node: TreeNode;
	level?: number;
	onCheck: (id: string, checked: boolean | "indeterminate") => void;
	checkedState: Map<string, boolean | "indeterminate">;
}) {
	const [isOpen, setIsOpen] = React.useState(false);
	const hasChildren = node.children && node.children.length > 0;
	const checked = checkedState.get(node.id);

	const handleCheck = (checked: boolean) => {
		onCheck(node.id, checked);
	};

	return (
		<div className="flex flex-col">
			<div className={`flex items-center py-1 ${level > 0 ? "ml-6" : ""}`}>
				<div className="flex items-center">
					{hasChildren && (
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="mr-1 focus:outline-none text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
							aria-label={isOpen ? "Collapse" : "Expand"}
						>
							{isOpen ? (
								<ChevronDownIcon className="h-4 w-4" />
							) : (
								<ChevronRightIcon className="h-4 w-4" />
							)}
						</button> 
					)}
					{!hasChildren && <span className="w-5" />}
					<Checkbox
						id={node.id}
						checked={checked}
						onCheckedChange={handleCheck}
					/>
					<label
						htmlFor={node.id}
						className="ml-2 cursor-pointer select-none text-sm text-gray-700 dark:text-gray-300"
					>
						{node.label}
					</label>
				</div>
			</div>
			{isOpen && hasChildren && (
				<div className="ml-6">
					{node.children?.map((child) => (
						<TreeNode
							key={child.id}
							node={child}
							level={level + 1}
							onCheck={onCheck}
							checkedState={checkedState}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function getDescendants(node: TreeNode): string[] {
	let descendants: string[] = [node.id];
	if (node.children) {
		node.children.forEach((child) => {
			descendants = descendants.concat(getDescendants(child));
		});
	}
	return descendants;
}

function getAncestors(id: string, nodes: TreeNode[]): string[] {
	for (const node of nodes) {
		if (node.id === id) {
			return [node.id];
		}
		if (node.children) {
			const path = getAncestors(id, node.children);
			if (path.length > 0) {
				return [node.id, ...path];
			}
		}
	}
	return [];
}

function findNode(id: string, nodes: TreeNode[]): TreeNode | null {
	for (const node of nodes) {
		if (node.id === id) {
			return node;
		}
		if (node.children) {
			const found = findNode(id, node.children);
			if (found) {
				return found;
			}
		}
	}
	return null;
}

export default function HierarchicalSelect() {
	const [checkedState, setCheckedState] = React.useState<
		Map<string, boolean | "indeterminate">
	>(new Map());

	const updateCheckedState = (
		id: string,
		checked: boolean | "indeterminate",
	) => {
		const newCheckedState = new Map(checkedState);

		const updateDescendants = (nodeId: string, state: boolean) => {
			const node = findNode(nodeId, treeData);
			if (node) {
				const descendants = getDescendants(node);
				descendants.forEach((descId) => {
					newCheckedState.set(descId, state);
				});
			}
		};

		const updateAncestors = (nodeId: string) => {
			const ancestors = getAncestors(nodeId, treeData);
			ancestors
				.slice(0, -1)
				.reverse()
				.forEach((ancId) => {
					const node = findNode(ancId, treeData);
					if (node?.children) {
						const childStates = node.children.map((child) =>
							newCheckedState.get(child.id),
						);
						if (childStates.every((state) => state === true)) {
							newCheckedState.set(ancId, true);
						} else if (
							childStates.some(
								(state) => state === true || state === "indeterminate",
							)
						) {
							newCheckedState.set(ancId, "indeterminate");
						} else {
							newCheckedState.set(ancId, false);
						}
					}
				});
		};

		if (checked === "indeterminate") {
			newCheckedState.set(id, false);
			updateDescendants(id, false);
		} else {
			newCheckedState.set(id, checked);
			updateDescendants(id, checked);
		}
		updateAncestors(id);

		setCheckedState(newCheckedState);
	};

	const handleCheck = (id: string, checked: boolean | "indeterminate") => {
		updateCheckedState(id, checked);
	};

	return (
		<div className="w-[300px] border border-gray-200 rounded-md p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
			{treeData.map((node) => (
				<TreeNode
					key={node.id}
					node={node}
					onCheck={handleCheck}
					checkedState={checkedState}
				/>
			))}
		</div>
	);
}
