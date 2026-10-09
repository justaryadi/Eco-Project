<?php

namespace App\Http\Controllers;

use App\Models\Quest;
use Illuminate\Http\Request;

class QuestController extends Controller
{
    public function index(Request $request)
    {
        return Quest::where('user_id', $request->user()->id)->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'priority' => 'nullable|string',
            'due_date' => 'nullable|date',
            'completed' => 'nullable|boolean',
        ]);

        $quest = Quest::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'priority' => $request->priority,
            'due_date' => $request->due_date,
            'completed' => $request->completed ?? false,
            'points_rewarded' => false,
        ]);

        return response()->json($quest, 201);
    }

    public function update(Request $request, $id)
    {
        $quest = Quest::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'priority' => 'nullable|string',
            'due_date' => 'nullable|date',
            'completed' => 'nullable|boolean',
        ]);

        // Simpan status sebelum diubah
        $wasCompleted = (bool) $quest->completed;

        $quest->update([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'priority' => $request->priority,
            'due_date' => $request->due_date,
            'completed' => $request->completed ?? false,
        ]);

        /*
        |--------------------------------------------------------------------------
        | POINT REWARD
        |--------------------------------------------------------------------------
        |
        | Jika quest baru saja berubah dari belum selesai
        | menjadi selesai, user mendapatkan 10 points.
        |
        */

        $isCompleted = (bool) $quest->completed;

        if (
            !$wasCompleted &&
            $isCompleted &&
            !$quest->points_rewarded
        ) {
            $user = $request->user();

            $user->points += 10;

            // Setiap 100 points = naik 1 level
            $user->level = intdiv($user->points, 100) + 1;

            $user->save();

            $quest->points_rewarded = true;
            $quest->save();
        }

        return response()->json([
            'message' => 'Quest berhasil diperbarui',
            'quest' => $quest,
            'points' => $request->user()->points,
            'level' => $request->user()->level,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $quest = Quest::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $quest->delete();

        return response()->json([
            'message' => 'Quest deleted'
        ]);
    }
}