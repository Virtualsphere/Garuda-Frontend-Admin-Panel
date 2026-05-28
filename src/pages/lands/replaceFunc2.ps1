$content = Get-Content -Raw "d:\development\Garuda-Frontend-Admin-Panel\src\pages\lands\LandVerificationDashboard.jsx"
$newFunc = Get-Content -Raw "d:\development\Garuda-Frontend-Admin-Panel\src\pages\lands\renderInlineEditForm2.txt"
$part1 = $content.Substring(0, $content.IndexOf("  // Render edit form INLINE (not modal)"))
$part2 = $content.Substring($content.IndexOf("  // Render land detail modal (view only)"))
$finalContent = $part1 + $newFunc + "`r`n" + $part2
Set-Content -Value $finalContent -Path "d:\development\Garuda-Frontend-Admin-Panel\src\pages\lands\LandVerificationDashboard.jsx"
