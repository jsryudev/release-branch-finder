# Release Branch Finder
Latest Release Branch Finder

## Create Workflow
Create a workflow (eg: `.github/workflows/finder.yml` see Creating a Workflow file) to utilize the labeler action with content:

```yml
- name: Find Latest Release Branch
  id: release-branch-finder
  uses: jsryudev/release-branch-finder@v0.1.0
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }}
    release-branch-prefix: release

- name: Echo Latest Release Branch
  run: echo "${{ steps.release-branch-finder.outputs.release-branch }}"
```

## Inputs
Various inputs are defined in [`action.yml`](action.yml)

| Name | Description | Default |
| - | - | - |
| `repo-token` | Token to use to authorize label changes. Typically the GITHUB_TOKEN secret | N/A |
| `release-branch-prefix` | The target release branch prefix | release |