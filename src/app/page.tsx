import { type TreeNode, TreeSelect } from "@/components/ui/tree-select";

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

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center h-screen p-4 gap-4">
			<h1>Hello World</h1>
			<TreeSelect data={treeData} />
		</div>
	);
}
