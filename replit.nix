{ pkgs }: {
    deps = [
        pkgs.wrangler
        pkgs.jq.bin
        pkgs.esbuild
        pkgs.nodejs-18_x

        pkgs.nodePackages.typescript
        pkgs.nodePackages.typescript-language-server
    ];
}